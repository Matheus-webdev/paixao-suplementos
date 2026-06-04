import { Router, type IRouter } from "express";
import { createHmac, timingSafeEqual } from "node:crypto";
import { db, ordersTable, orderItemsTable, usersTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { requireAuth } from "../lib/auth";
import { notifyPaymentConfirmed } from "../lib/telegram";

const router: IRouter = Router();

const accessToken = process.env["MERCADOPAGO_ACCESS_TOKEN"];
const mpClient = accessToken ? new MercadoPagoConfig({ accessToken }) : null;

function getPublicBaseUrl(req: import("express").Request): string {
  const envUrl = process.env["PUBLIC_BASE_URL"];
  if (envUrl) return envUrl.replace(/\/$/, "");
  const proto = (req.headers["x-forwarded-proto"] as string)?.split(",")[0] ?? req.protocol;
  const host = (req.headers["x-forwarded-host"] as string) ?? req.headers.host ?? "";
  return `${proto}://${host}`;
}

router.post("/create-preference", requireAuth, async (req, res) => {
  if (!mpClient) {
    res.status(500).json({ error: "Pagamento online indisponível no momento." });
    return;
  }
  const orderId = (req.body?.orderId ?? "") as string;
  if (!orderId) { res.status(400).json({ error: "orderId obrigatório." }); return; }

  const userId = req.session.userId!;
  const [order] = await db.select().from(ordersTable)
    .where(and(eq(ordersTable.id, orderId), eq(ordersTable.userId, userId))).limit(1);
  if (!order) { res.status(404).json({ error: "Pedido não encontrado." }); return; }

  const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, order.id));
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);

  const baseUrl = getPublicBaseUrl(req);
  const isPix = order.paymentMethod === "pix";

  try {
    const pref = new Preference(mpClient);
    const result = await pref.create({
      body: {
        items: items.map((i) => ({
          id: String(i.productId ?? i.id),
          title: `${i.productName}${i.flavor ? ` (${i.flavor})` : ""}`,
          quantity: i.quantity,
          unit_price: Number(i.unitPrice),
          currency_id: "BRL",
        })),
        payer: {
          name: order.addressSnapshot.firstName,
          surname: order.addressSnapshot.lastName,
          email: user?.email ?? "comprador@paixaosuplementos.com",
        },
        external_reference: order.id,
        back_urls: {
          success: `${baseUrl}/pagamento/sucesso?order=${order.id}`,
          failure: `${baseUrl}/pagamento/falha?order=${order.id}`,
          pending: `${baseUrl}/pagamento/pendente?order=${order.id}`,
        },
        notification_url: `${baseUrl}/api/payments/webhook`,
        statement_descriptor: "PAIXAOSUPLE",
        payment_methods: isPix
          ? { excluded_payment_types: [{ id: "credit_card" }, { id: "debit_card" }, { id: "ticket" }] }
          : { excluded_payment_types: [{ id: "ticket" }], installments: 6 },
      },
    });

    const initPoint = result.init_point ?? result.sandbox_init_point;
    if (!initPoint) { res.status(500).json({ error: "Não foi possível gerar o link de pagamento." }); return; }

    const newPaymentData = { ...(order.paymentData ?? {}), mpPreferenceId: result.id };
    await db.update(ordersTable)
      .set({ paymentData: newPaymentData, updatedAt: new Date() })
      .where(eq(ordersTable.id, order.id));

    res.json({ initPoint, preferenceId: result.id });
  } catch (err) {
    const mpErr = err as { message?: string; cause?: unknown; status?: number };
    req.log.error({ err: mpErr, cause: mpErr.cause }, "Failed to create MP preference");
    const detail = typeof mpErr.message === "string" ? mpErr.message : "Erro desconhecido";
    res.status(500).json({ error: `Erro ao gerar pagamento: ${detail}` });
  }
});

// Public webhook (no auth) — Mercado Pago calls this
router.post("/webhook", async (req, res) => {
  // Verify MP signature before doing anything
  const secret = process.env["MERCADOPAGO_WEBHOOK_SECRET"];
  const body = req.body ?? {};
  const dataId: string | undefined = body.data?.id ?? body.id;

  // Fail closed: if the secret is missing we cannot verify the request, so reject it
  if (!secret) {
    req.log.error("MP webhook rejected: MERCADOPAGO_WEBHOOK_SECRET is not configured");
    res.status(503).json({ error: "webhook signature verification not configured" });
    return;
  }

  const sigHeader = String(req.header("x-signature") ?? "");
  const requestId = String(req.header("x-request-id") ?? "");
  const parts = Object.fromEntries(
    sigHeader.split(",").map((p) => {
      const [k, ...v] = p.trim().split("=");
      return [k ?? "", v.join("=")];
    }),
  );
  const ts = parts["ts"];
  const v1 = parts["v1"];

  if (!ts || !v1 || !dataId) {
    req.log.warn({ sigHeader, requestId, dataId }, "MP webhook missing signature fields");
    res.status(401).json({ error: "invalid signature" });
    return;
  }

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");
  const expectedBuf = Buffer.from(expected, "hex");
  const receivedBuf = Buffer.from(v1, "hex");

  if (expectedBuf.length !== receivedBuf.length || !timingSafeEqual(expectedBuf, receivedBuf)) {
    req.log.warn({ requestId, dataId }, "MP webhook signature mismatch");
    res.status(401).json({ error: "invalid signature" });
    return;
  }

  // Always 200 to MP; do work after
  res.status(200).json({ received: true });

  if (!mpClient) return;

  try {
    const type = body.type ?? body.topic;
    if (type !== "payment" || !dataId) return;

    const paymentApi = new Payment(mpClient);
    const payment = await paymentApi.get({ id: dataId });

    const orderId = payment.external_reference;
    if (!orderId) return;

    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId)).limit(1);
    if (!order) return;

    let nextStatus: string | null = null;
    switch (payment.status) {
      case "approved": nextStatus = "Pago"; break;
      case "rejected":
      case "cancelled": nextStatus = "Cancelado"; break;
      default: nextStatus = null; // in_process / pending — keep "Aguardando Pagamento"
    }

    const newPaymentData = {
      ...(order.paymentData ?? {}),
      mpPaymentId: payment.id,
      mpStatus: payment.status,
      mpStatusDetail: payment.status_detail,
    };

    await db.update(ordersTable)
      .set({
        ...(nextStatus ? { status: nextStatus } : {}),
        paymentData: newPaymentData,
        updatedAt: new Date(),
      })
      .where(eq(ordersTable.id, order.id));

    // Notify owner via Telegram only when payment becomes "Pago"
    if (nextStatus === "Pago" && order.status !== "Pago") {
      const [user] = await db.select({ name: usersTable.name })
        .from(usersTable).where(eq(usersTable.id, order.userId)).limit(1);
      await notifyPaymentConfirmed(order.orderNumber, order.total, user?.name ?? "Cliente");
    }
  } catch (err) {
    req.log.error({ err }, "MP webhook processing failed");
  }
});

export default router;
