import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { Admin } from "../models/Admin.js";
import { RevokedToken } from "../models/RevokedToken.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again in 15 minutes." },
});

const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(200),
});

router.post("/login", loginLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const { email, password } = parsed.data;

  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) return res.status(401).json({ error: "Invalid credentials" });

  if (admin.lockedUntil && admin.lockedUntil > new Date()) {
    return res.status(423).json({ error: "Account temporarily locked. Try later." });
  }

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) {
    admin.failedAttempts = (admin.failedAttempts || 0) + 1;
    if (admin.failedAttempts >= 5) {
      admin.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
      admin.failedAttempts = 0;
    }
    await admin.save();
    return res.status(401).json({ error: "Invalid credentials" });
  }

  admin.failedAttempts = 0;
  admin.lockedUntil = null;
  admin.lastLoginAt = new Date();
  await admin.save();

  const jti = crypto.randomUUID();
  const token = jwt.sign({ sub: admin._id.toString(), jti }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  res.json({
    token,
    admin: { id: admin._id, email: admin.email, name: admin.name },
  });
});

router.post("/logout", requireAuth, async (req, res) => {
  await RevokedToken.create({
    jti: req.tokenJti,
    expiresAt: new Date(req.tokenExp * 1000),
  });
  res.json({ ok: true });
});

router.get("/me", requireAuth, async (req, res) => {
  res.json({
    admin: {
      id: req.admin._id,
      email: req.admin.email,
      name: req.admin.name,
      lastLoginAt: req.admin.lastLoginAt,
    },
  });
});

export default router;