import { logger } from "./logger";

const BOT_TOKEN = process.env["TELEGRAM_BOT_TOKEN"];
const CHAT_ID = process.env["TELEGRAM_CHAT_ID"];

export function isTelegramConfigured(): boolean {
  return Boolean(BOT_TOKEN && CHAT_ID);
}

export async function sendTelegramMessage(text: string): Promise<void> {
  if (!BOT_TOKEN || !CHAT_ID) {
    logger.debug("Telegram not configured, skipping notification");
    return;
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      logger.error({ status: res.status, body }, "Telegram sendMessage failed");
    }
  } catch (err) {
    logger.error({ err }, "Telegram sendMessage threw");
  }
}

function brl(n: number | string): string {
  const v = typeof n === "string" ? Number(n) : n;
  return `R$ ${v.toFixed(2).replace(".", ",")}`;
}

const PAYMENT_LABEL: Record<string, string> = {
  pix: "PIX",
  credito: "Crédito (Mercado Pago)",
  nubank: "Nubank",
  credito_pix: "Crédito + PIX",
  dois_cartoes: "Dois cartões",
};

type OrderItemForNotif = {
  productName: string;
  brand: string;
  flavor: string | null;
  quantity: number;
  unitPrice: string | number;
};

type OrderForNotif = {
  orderNumber: number;
  total: string | number;
  paymentMethod: string;
  status: string;
  installments: number;
  customerName: string;
  customerPhone?: string | null;
  city?: string | null;
  state?: string | null;
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function notifyOrderCreated(order: OrderForNotif, items: OrderItemForNotif[]): Promise<void> {
  if (!isTelegramConfigured()) return;
  const itemsText = items
    .map((i) => `• ${i.quantity}x ${escapeHtml(i.productName)}${i.flavor ? ` (${escapeHtml(i.flavor)})` : ""} — ${brl(Number(i.unitPrice) * i.quantity)}`)
    .join("\n");
  const payment = PAYMENT_LABEL[order.paymentMethod] ?? order.paymentMethod;
  const installments = order.installments > 1 ? ` em ${order.installments}x` : "";
  const location = [order.city, order.state].filter(Boolean).join(" / ");
  const phone = order.customerPhone ? `\n📞 ${escapeHtml(order.customerPhone)}` : "";

  const text =
    `🛒 <b>Novo pedido #${order.orderNumber}</b>\n` +
    `Status: <b>${escapeHtml(order.status)}</b>\n\n` +
    `👤 ${escapeHtml(order.customerName)}${phone}\n` +
    (location ? `📍 ${escapeHtml(location)}\n\n` : "\n") +
    `${itemsText}\n\n` +
    `💳 ${escapeHtml(payment)}${installments}\n` +
    `💰 <b>Total: ${brl(order.total)}</b>`;

  await sendTelegramMessage(text);
}

export async function notifyPasswordResetRequested(email: string, name: string, resetUrl: string): Promise<void> {
  const text =
    `🔐 <b>Recuperação de senha</b>\n\n` +
    `👤 ${escapeHtml(name)}\n` +
    `✉️ ${escapeHtml(email)}\n\n` +
    `Link de redefinição (válido por 1 hora):\n${escapeHtml(resetUrl)}\n\n` +
    `<i>Envie este link pelo WhatsApp para o cliente.</i>`;
  await sendTelegramMessage(text);
}

export async function notifyPaymentConfirmed(orderNumber: number, total: string | number, customerName: string): Promise<void> {
  if (!isTelegramConfigured()) return;
  const text =
    `✅ <b>Pagamento confirmado!</b>\n` +
    `Pedido <b>#${orderNumber}</b>\n` +
    `👤 ${escapeHtml(customerName)}\n` +
    `💰 <b>${brl(total)}</b>\n\n` +
    `Pode começar a preparar 📦`;
  await sendTelegramMessage(text);
}
