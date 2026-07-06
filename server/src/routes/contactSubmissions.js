import { Router } from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { ContactSubmission } from "../models/ContactSubmission.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 4,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many submissions. Please slow down." },
});

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  budget: z.string().max(80).default(""),
  projectDetails: z.string().trim().min(20).max(5000),
  fileUrls: z.array(z.string().url()).max(10).default([]),
  website: z.string().max(0).optional(), // honeypot
});

// Public — submit
router.post("/contact", publicLimiter, async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  if (parsed.data.website) return res.status(200).json({ ok: true }); // silently drop bots

  await ContactSubmission.create({
    name: parsed.data.name,
    email: parsed.data.email,
    budget: parsed.data.budget,
    projectDetails: parsed.data.projectDetails,
    fileUrls: parsed.data.fileUrls,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"] || "",
  });
  res.status(201).json({ ok: true });
});

// Admin
router.get("/contact-submissions", requireAuth, async (req, res) => {
  const status = req.query.status;
  const filter = status && ["new", "replied", "archived"].includes(status) ? { status } : {};
  const list = await ContactSubmission.find(filter).sort({ createdAt: -1 }).lean();
  res.json({ submissions: list });
});

router.patch("/contact-submissions/:id", requireAuth, async (req, res) => {
  const { status } = req.body || {};
  if (!["new", "replied", "archived"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  const updated = await ContactSubmission.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  );
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json({ submission: updated });
});

export default router;