import mongoose from "mongoose";

export const ConnectDB = async () => {
  // Cek apakah sudah ada koneksi (biar gak connect ulang terus)
  if (mongoose.connections[0].readyState) {
    return;
  }

  try {
    // Pakai variabel dari .env, bukan hardcode string
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
