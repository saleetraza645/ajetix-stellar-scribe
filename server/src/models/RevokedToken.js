import mongoose from "mongoose";

const RevokedTokenSchema = new mongoose.Schema(
  {
    jti: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

// TTL index — Mongo auto-deletes docs after `expiresAt`
RevokedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RevokedToken =
  mongoose.models.RevokedToken || mongoose.model("RevokedToken", RevokedTokenSchema);