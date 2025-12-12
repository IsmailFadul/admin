import mongoose from "mongoose";

export async function mongooseConnect() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  }

  const uri = process.env.MONGODB_URI; // ✅ correct spelling
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in .env.local");
  }

  return mongoose.connect(uri);
}
