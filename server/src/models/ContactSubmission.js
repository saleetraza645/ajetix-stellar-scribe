import mongoose from "mongoose";

const ContactSubmissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    budget: { type: String, default: "" },
    projectDetails: { type: String, required: true },
    fileUrls: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["new", "replied", "archived"],
      default: "new",
      index: true,
    },
    ipAddress: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: true },
);

export const ContactSubmission =
  mongoose.models.ContactSubmission ||
  mongoose.model("ContactSubmission", ContactSubmissionSchema);