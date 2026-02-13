import mongoose from "mongoose";

const Email = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email wajib diisi"],
    unique: true, // Email gak boleh kembar
    match: [/.+\@.+\..+/, "Format email salah"], // Validasi format email
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const EmailModel = mongoose.models.email || mongoose.model("email", Email);

export default EmailModel;
