import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "./db.js";
import { Admin } from "./models/Admin.js";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";
  if (!email || !password) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env");
    process.exit(1);
  }
  await connectDB();
  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await Admin.findOneAndUpdate(
    { email: email.toLowerCase() },
    { email: email.toLowerCase(), passwordHash, name },
    { upsert: true, new: true },
  );
  console.log(`[seed] admin ready: ${admin.email}`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});