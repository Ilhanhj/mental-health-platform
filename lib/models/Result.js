import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: String, required: false }, // Umur boleh string/number

  // Skor Angka
  depressionScore: { type: Number, required: true },
  anxietyScore: { type: Number, required: true },
  stressScore: { type: Number, required: true },

  // Level (String: "Normal", "Parah", dll)
  depressionLevel: { type: String, required: true },
  anxietyLevel: { type: String, required: true },
  stressLevel: { type: String, required: true },

  date: { type: Date, default: Date.now },
});

const ResultModel = mongoose.models.result || mongoose.model("result", Schema);

export default ResultModel;
