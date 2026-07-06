import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import contactRoutes from "./routes/contactSubmissions.js";
import analyticsRoutes from "./routes/analytics.js";

const app = express();
app.set("trust proxy", 1);
app.use(helmet());
app.use(express.json({ limit: "1mb" }));

const origins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || origins.length === 0 || origins.includes(origin)) return cb(null, true);
      cb(new Error("CORS: origin not allowed"));
    },
    credentials: true,
  }),
);

app.get("/health", (_req, res) => res.json({ ok: true, ts: Date.now() }));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", contactRoutes); // exposes /api/contact and /api/contact-submissions
app.use("/api/analytics", analyticsRoutes);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("[error]", err);
  res.status(500).json({ error: "Internal server error" });
});

const port = Number(process.env.PORT || 4000);
connectDB()
  .then(() => {
    app.listen(port, () => console.log(`[api] listening on :${port}`));
  })
  .catch((err) => {
    console.error("[api] failed to connect to Mongo:", err);
    process.exit(1);
  });