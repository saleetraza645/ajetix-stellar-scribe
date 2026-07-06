import { Router } from "express";
import { z } from "zod";
import multer from "multer";
import { Project } from "../models/Project.js";
import { requireAuth } from "../middleware/auth.js";
import { uploadImage } from "../../utils/cloudinary.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

const projectSchema = z.object({
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/, "kebab-case slug"),
  title: z.string().min(1).max(200),
  category: z.string().min(1).max(80),
  tagline: z.string().min(1).max(300),
  description: z.string().min(1).max(5000),
  tech: z.array(z.string().max(80)).max(30).default([]),
  outcome: z.string().max(500).default(""),
  gradient: z.string().max(200).default("from-[#3B82F6] to-[#8B5CF6]"),
  coverImage: z.string().url().optional().or(z.literal("")).default(""),
  gallery: z.array(z.string().url()).max(20).default([]),
  client: z.string().max(200).default(""),
  timeline: z.string().max(200).default(""),
  published: z.boolean().default(true),
  order: z.number().int().default(0),
});

// Public
router.get("/", async (_req, res) => {
  const list = await Project.find({ published: true })
    .sort({ order: 1, createdAt: -1 })
    .lean();
  res.json({ projects: list });
});

// Admin — list ALL (including unpublished). Must be declared before /:slug.
router.get("/admin/all", requireAuth, async (_req, res) => {
  const list = await Project.find({}).sort({ order: 1, createdAt: -1 }).lean();
  res.json({ projects: list });
});

router.get("/admin/by-id/:id", requireAuth, async (req, res) => {
  const project = await Project.findById(req.params.id).lean();
  if (!project) return res.status(404).json({ error: "Not found" });
  res.json({ project });
});

router.get("/:slug", async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug, published: true }).lean();
  if (!project) return res.status(404).json({ error: "Not found" });
  res.json({ project });
});

router.post("/:slug/view", async (req, res) => {
  await Project.updateOne({ slug: req.params.slug }, { $inc: { views: 1 } });
  res.json({ ok: true });
});

// Admin
router.post("/", requireAuth, async (req, res) => {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const created = await Project.create(parsed.data);
    res.status(201).json({ project: created });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ error: "Slug already exists" });
    res.status(500).json({ error: "Create failed" });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  const parsed = projectSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const updated = await Project.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json({ project: updated });
});

router.delete("/:id", requireAuth, async (req, res) => {
  const deleted = await Project.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

router.post("/:id/images", requireAuth, upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image file provided" });

  try {
    const { secure_url } = await uploadImage(req.file.buffer);
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { coverImage: secure_url },
      { new: true },
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json({ project: updated, coverImage: secure_url });
  } catch (err) {
    console.error("[projects] image upload failed:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;