import mongoose from "mongoose";

let connected = false;

export async function connectDB() {
  if (connected) return mongoose.connection;
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is not set");
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  connected = true;
  console.log("[db] connected");
  return mongoose.connection;
}