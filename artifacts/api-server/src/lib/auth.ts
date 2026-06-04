import bcrypt from "bcryptjs";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import type { RequestHandler } from "express";
import { pool } from "@workspace/db";

const PgStore = connectPgSimple(session);

const SESSION_SECRET = process.env["SESSION_SECRET"];
if (!SESSION_SECRET) {
  throw new Error("SESSION_SECRET is required.");
}

export const sessionMiddleware = session({
  store: new PgStore({
    pool,
    tableName: "session",
    createTableIfMissing: false,
  }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  name: "paixao.sid",
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  },
});

declare module "express-session" {
  interface SessionData {
    userId?: string;
    role?: "customer" | "admin";
  }
}

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.session.userId) {
    res.status(401).json({ error: "Não autenticado." });
    return;
  }
  next();
};

export const requireAdmin: RequestHandler = (req, res, next) => {
  if (!req.session.userId) {
    res.status(401).json({ error: "Não autenticado." });
    return;
  }
  if (req.session.role !== "admin") {
    res.status(403).json({ error: "Acesso restrito ao administrador." });
    return;
  }
  next();
};
