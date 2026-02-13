import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nama wajib diisi"],
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, "Email wajib diisi"],
    unique: true, // Email gak boleh kembar
    match: [/.+\@.+\..+/, "Format email salah"], // Validasi format email
  },
  password: {
    type: String,
    required: [true, "Password wajib diisi"],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["user", "admin"], // Cuma boleh 'user' atau 'admin'
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
