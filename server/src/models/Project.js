import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    tech: { type: [String], default: [] },
    outcome: { type: String, default: "" },
    gradient: { type: String, default: "from-[#3B82F6] to-[#8B5CF6]" },
    coverImage: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    client: { type: String, default: "" },
    timeline: { type: String, default: "" },
    published: { type: Boolean, default: true, index: true },
    views: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);