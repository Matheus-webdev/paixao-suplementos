import { Router, type IRouter } from "express";
import { db, usersTable, insertUserSchema, passwordResetTokensTable } from "@workspace/db";
import { and, eq, gt, isNull } from "drizzle-orm";
import { z } from "zod";
import crypto from "crypto";
import { hashPassword, verifyPassword, requireAuth } from "../lib/auth";
import { notifyPasswordResetRequested } from "../lib/telegram";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const loginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(1, "Informe sua senha."),
});

router.post("/register", async (req, res) => {
  const parsed = insertUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos." });
    return;
  }
  const { name, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();
  const existing = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.email, normalizedEmail)).limit(1);
  if (existing.length > 0) {
    res.status(409).json({ error: "Já existe uma conta com esse e-mail." });
    return;
  }
  const passwordHash = await hashPassword(password);
  const [user] = await db.insert(usersTable).values({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: "customer",
  }).returning({ id: usersTable.id, name: usersTable.name, email: usersTable.email, role: usersTable.role });
  if (!user) {
    res.status(500).json({ error: "Erro ao criar conta." });
    return;
  }
  req.session.userId = user.id;
  req.session.role = user.role as "customer" | "admin";
  res.status(201).json({ user });
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos." });
    return;
  }
  const { email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, normalizedEmail)).limit(1);
  if (!user) {
    res.status(401).json({ error: "E-mail ou senha incorretos." });
    return;
  }
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    res.status(401).json({ error: "E-mail ou senha incorretos." });
    return;
  }
  req.session.userId = user.id;
  req.session.role = user.role as "customer" | "admin";
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("paixao.sid");
    res.json({ ok: true });
  });
});

router.get("/me", requireAuth, async (req, res) => {
  const [user] = await db.select({
    id: usersTable.id, name: usersTable.name, email: usersTable.email, role: usersTable.role,
  }).from(usersTable).where(eq(usersTable.id, req.session.userId!)).limit(1);
  if (!user) {
    req.session.destroy(() => res.status(401).json({ error: "Sessão inválida." }));
    return;
  }
  res.json({ user });
});

/* ---------------- Password Recovery ---------------- */

const forgotSchema = z.object({
  email: z.string().email("E-mail inválido."),
});

const resetSchema = z.object({
  token: z.string().min(20, "Token inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

function hashToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

router.post("/forgot", async (req, res) => {
  const parsed = forgotSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos." });
    return;
  }
  const normalizedEmail = parsed.data.email.toLowerCase().trim();

  // Always respond success to avoid leaking which emails exist
  const respondOk = () => res.json({ ok: true });

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, normalizedEmail)).limit(1);
  if (!user) {
    respondOk();
    return;
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await db.insert(passwordResetTokensTable).values({
    userId: user.id,
    tokenHash,
    expiresAt,
  });

  const origin = (req.headers.origin as string) || `${req.protocol}://${req.get("host")}`;
  const resetUrl = `${origin}/redefinir-senha?token=${rawToken}`;

  try {
    await notifyPasswordResetRequested(user.email, user.name, resetUrl);
  } catch (err) {
    logger.error({ err }, "Failed to send password reset notification");
  }
  // Also log so the admin can recover the link if Telegram is offline
  logger.info({ email: user.email, resetUrl }, "Password reset requested");

  respondOk();
});

router.get("/reset-info", async (req, res) => {
  const token = String(req.query["token"] ?? "");
  if (token.length < 20) {
    res.status(400).json({ error: "Token inválido." });
    return;
  }
  const tokenHash = hashToken(token);
  const [row] = await db
    .select({
      id: passwordResetTokensTable.id,
      expiresAt: passwordResetTokensTable.expiresAt,
      usedAt: passwordResetTokensTable.usedAt,
      email: usersTable.email,
      name: usersTable.name,
    })
    .from(passwordResetTokensTable)
    .innerJoin(usersTable, eq(usersTable.id, passwordResetTokensTable.userId))
    .where(eq(passwordResetTokensTable.tokenHash, tokenHash))
    .limit(1);
  if (!row || row.usedAt || row.expiresAt.getTime() < Date.now()) {
    res.status(400).json({ error: "Link inválido ou expirado. Solicite uma nova recuperação." });
    return;
  }
  // Mask email: ab***@gmail.com
  const masked = row.email.replace(/^(.{2})(.*)(@.*)$/, (_m, a: string, b: string, c: string) => a + "*".repeat(Math.max(b.length, 3)) + c);
  res.json({ email: masked, name: row.name.split(" ")[0] ?? row.name });
});

router.post("/reset", async (req, res) => {
  const parsed = resetSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos." });
    return;
  }
  const tokenHash = hashToken(parsed.data.token);

  const [row] = await db
    .select()
    .from(passwordResetTokensTable)
    .where(and(
      eq(passwordResetTokensTable.tokenHash, tokenHash),
      isNull(passwordResetTokensTable.usedAt),
      gt(passwordResetTokensTable.expiresAt, new Date()),
    ))
    .limit(1);

  if (!row) {
    res.status(400).json({ error: "Link inválido ou expirado. Solicite uma nova recuperação." });
    return;
  }

  const passwordHash = await hashPassword(parsed.data.password);
  await db.update(usersTable).set({ passwordHash }).where(eq(usersTable.id, row.userId));
  await db.update(passwordResetTokensTable).set({ usedAt: new Date() }).where(eq(passwordResetTokensTable.id, row.id));

  // Invalidate any other outstanding tokens for this user
  await db.update(passwordResetTokensTable)
    .set({ usedAt: new Date() })
    .where(and(eq(passwordResetTokensTable.userId, row.userId), isNull(passwordResetTokensTable.usedAt)));

  res.json({ ok: true });
});

export default router;
