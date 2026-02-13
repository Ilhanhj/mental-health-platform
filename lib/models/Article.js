import mongoose from "mongoose";

const Article = new mongoose.Schema({
  // Sesuai field 'title'
  title: {
    type: String,
    required: true,
  },

  // Sesuai field 'description'
  description: {
    type: String,
    required: true,
  },

  // Sesuai field 'image' (Di DB simpan URL-nya, misal: "/images/blog1.png")
  image: {
    type: String,
    required: true,
  },

  // Sesuai field 'category'
  category: {
    type: String,
    required: true,
  },

  // Sesuai field 'author'
  author: {
    type: String,
    required: true,
  },

  // Sesuai field 'date'
  date: {
    type: Date,
    default: Date.now,
  },
});

// Cek biar gak error saat hot-reload Next.js
const ArticleModel = mongoose.models.Article || mongoose.model("Article", Article);

export default ArticleModel;
