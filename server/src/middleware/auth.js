import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";
import { RevokedToken } from "../models/RevokedToken.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing bearer token" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload?.jti || !payload?.sub) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const revoked = await RevokedToken.findOne({ jti: payload.jti }).lean();
    if (revoked) return res.status(401).json({ error: "Token revoked" });

    const admin = await Admin.findById(payload.sub).lean();
    if (!admin) return res.status(401).json({ error: "Admin no longer exists" });

    req.admin = admin;
    req.tokenJti = payload.jti;
    req.tokenExp = payload.exp;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}