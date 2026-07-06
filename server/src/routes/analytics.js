import { Router } from "express";
import { ContactSubmission } from "../models/ContactSubmission.js";
import { Project } from "../models/Project.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/summary", requireAuth, async (_req, res) => {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [total, week, month, newCount, topProjects] = await Promise.all([
    ContactSubmission.countDocuments({}),
    ContactSubmission.countDocuments({ createdAt: { $gte: weekAgo } }),
    ContactSubmission.countDocuments({ createdAt: { $gte: monthAgo } }),
    ContactSubmission.countDocuments({ status: "new" }),
    Project.find({ published: true }).sort({ views: -1 }).limit(5).select("slug title views").lean(),
  ]);

  res.json({
    submissions: { total, week, month, new: newCount },
    topProjects,
  });
});

export default router;