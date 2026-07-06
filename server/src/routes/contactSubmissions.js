import { Router } from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
<<<<<<< HEAD
import multer from "multer";
import { ContactSubmission } from "../models/ContactSubmission.js";
import { requireAuth } from "../middleware/auth.js";
import { sendContactEmail } from "../../utils/mailer.js";
import { uploadImage } from "../../utils/cloudinary.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 5 },
});

=======
import { ContactSubmission } from "../models/ContactSubmission.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

>>>>>>> a25318459c6d5f0d463fa1ed2c0fa7553a6d1ef2
const publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 4,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many submissions. Please slow down." },
});

<<<<<<< HEAD
const fileEntrySchema = z.union([
  z.string(),
  z.object({
    name: z.string(),
    path: z.string(),
    url: z.string().optional(),
    size: z.number().optional(),
  }),
]);

=======
>>>>>>> a25318459c6d5f0d463fa1ed2c0fa7553a6d1ef2
const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  budget: z.string().max(80).default(""),
  projectDetails: z.string().trim().min(20).max(5000),
<<<<<<< HEAD
  fileUrls: z.array(fileEntrySchema).max(10).default([]),
  website: z.string().max(0).optional(), // honeypot
});

async function uploadAttachments(files = []) {
  const out = [];
  for (const file of files) {
    const entry = { name: file.originalname, path: file.originalname, size: file.size };
    try {
      if (process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_URL) {
        const { secure_url } = await uploadImage(file.buffer, "ajetix/contact");
        entry.path = secure_url;
        entry.url = secure_url;
      }
    } catch (err) {
      console.error("[contact] attachment upload failed:", err);
    }
    out.push(entry);
  }
  return out;
}

// Public — submit (JSON or multipart/form-data with optional files)
router.post("/contact", publicLimiter, upload.array("files", 5), async (req, res) => {
  try {
    const uploaded = await uploadAttachments(req.files);
    const parsed = contactSchema.safeParse({
      name: req.body?.name,
      email: req.body?.email,
      budget: req.body?.budget ?? "",
      projectDetails: req.body?.projectDetails,
      fileUrls: uploaded,
      website: req.body?.website,
    });

    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
    if (parsed.data.website) return res.status(200).json({ ok: true }); // silently drop bots

    const submission = await ContactSubmission.create({
      name: parsed.data.name,
      email: parsed.data.email,
      budget: parsed.data.budget,
      projectDetails: parsed.data.projectDetails,
      fileUrls: parsed.data.fileUrls.map((f) =>
        typeof f === "string" ? f : f.url || f.path || f.name,
      ),
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"] || "",
    });

    try {
      await sendContactEmail({ ...submission.toObject(), fileUrls: parsed.data.fileUrls });
    } catch (err) {
      console.error("[contact] email send failed:", err);
    }

    res.status(201).json({ ok: true });
  } catch (err) {
    console.error("[contact] submission failed:", err);
    res.status(500).json({ error: "Submission failed" });
  }
=======
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
>>>>>>> a25318459c6d5f0d463fa1ed2c0fa7553a6d1ef2
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

<<<<<<< HEAD
export default router;
=======
export default router;
>>>>>>> a25318459c6d5f0d463fa1ed2c0fa7553a6d1ef2
