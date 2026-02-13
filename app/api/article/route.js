import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db"; // Sesuaikan path import ini
import Article from "@/lib/models/Article.js"; // Pastikan import Model benar
import { writeFile, unlink } from "fs/promises";
import path from "path";

export async function GET(request) {
  try {
    await ConnectDB();

    // Ambil semua data dari database
    const articles = await Article.find({});

    // Kirim sebagai JSON
    return NextResponse.json({ success: true, articles });
  } catch (error) {
    console.error("🔥 ERROR DETAIL:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function POST(request) {
  try {
    // 1. Pastikan DB Connect DULU sebelum ngapa-ngapain
    await ConnectDB();

    const formData = await request.formData();
    const timestamp = Date.now();

    // --- LOGIKA UPLOAD GAMBAR ---
    const image = formData.get("image");
    if (!image) {
      return NextResponse.json({ success: false, msg: "Gambar wajib diisi" }, { status: 400 });
    }

    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);

    // Simpan ke folder public/articles_images (Pastikan folder sudah ada manual)
    const fileName = `${timestamp}_${image.name.replaceAll(" ", "_")}`;
    const filePath = path.join(process.cwd(), "public/articles_images", fileName);

    await writeFile(filePath, buffer);

    const imageUrl = `/articles_images/${fileName}`;

    // --- LOGIKA SIMPAN KE DB ---
    const articleData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      author: formData.get("author"),
      image: imageUrl,
      // Pastikan author_img sudah TIDAK ADA disini
    };

    // LOG DATA SEBELUM SIMPAN (Buat ngecek di terminal)
    console.log("📝 Mencoba simpan data:", articleData);

    await Article.create(articleData);

    console.log("✅ Berhasil disimpan!");
    return NextResponse.json({ success: true, message: "Article Created" });
  } catch (error) {
    // INI YANG PALING PENTING
    console.error("🔥 ERROR DETAIL:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
        error: error.message, // Ini akan muncul di Postman/Browser
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const id = request.nextUrl.searchParams.get("id"); // 1. Ambil ID dari URL

    // 2. Cari data artikel dulu (karena kita butuh path gambarnya)
    const article = await Article.findById(id);

    if (!article) {
      return NextResponse.json({ success: false, message: "Artikel tidak ditemukan" }, { status: 404 });
    }

    // 3. Hapus File Gambar Fisik (Penting biar gak nyampah)
    try {
      // article.image contohnya: "/articles_images/171542_foto.jpg"
      // Kita harus ubah jadi path lengkap sistem: "C:/Users/.../public/articles_images/..."
      const imagePath = path.join(process.cwd(), "public", article.image);

      await unlink(imagePath); // Hapus file
      console.log("🗑️ File gambar berhasil dihapus:", imagePath);
    } catch (err) {
      // Kalau file gak ada (mungkin udah kehapus manual), lanjut aja hapus DB
      console.log("⚠️ Gagal hapus file gambar (mungkin file sudah hilang):", err.message);
    }

    // 4. Hapus Data dari Database MongoDB
    await Article.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Artikel dan gambar berhasil dihapus" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ success: false, message: "Gagal menghapus artikel" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await ConnectDB(); // Pastikan DB Konek

    const formData = await request.formData();
    const articleId = formData.get("id");

    // Validasi ID
    if (!articleId) {
      return NextResponse.json({ success: false, message: "ID Artikel tidak ditemukan" }, { status: 400 });
    }

    // Cari Data Lama
    const oldData = await Article.findById(articleId);
    if (!oldData) {
      return NextResponse.json({ success: false, message: "Artikel tidak ditemukan di Database" }, { status: 404 });
    }

    // Siapkan Update Data Dasar
    const updateData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      author: formData.get("author"),
    };

    // LOGIKA GAMBAR YANG LEBIH AMAN
    const image = formData.get("image");

    // Cek apakah 'image' adalah FILE (punya size & type)
    if (image && typeof image === "object" && image.size > 0) {
      // 1. User upload gambar baru
      const timestamp = Date.now();
      const imageByteData = await image.arrayBuffer();
      const buffer = Buffer.from(imageByteData);
      const fileName = `${timestamp}_${image.name.replaceAll(" ", "_")}`;
      const filePath = path.join(process.cwd(), "public/articles_images", fileName);

      // Simpan file baru
      await writeFile(filePath, buffer);

      // Update URL di database
      updateData.image = `/articles_images/${fileName}`;

      // 2. Hapus gambar lama (Opsional, pakai try-catch biar gak error 500 kalau file lama gak ada)
      try {
        // Hapus slash di depan biar path.join gak bingung
        const oldImageRelativePath = oldData.image.replace(/^\//, "");
        const oldImagePath = path.join(process.cwd(), "public", oldImageRelativePath);
        await unlink(oldImagePath);
      } catch (err) {
        console.log("⚠️ Gagal hapus gambar lama (tidak fatal):", err.message);
      }
    }
    // Jika tidak ada gambar baru, updateData.image tidak diset (tetap pakai yang lama)

    // Update Database
    await Article.findByIdAndUpdate(articleId, updateData);

    return NextResponse.json({ success: true, message: "Artikel berhasil diupdate" });
  } catch (error) {
    console.error("🔥 UPDATE ERROR:", error); // Cek terminal VS Code untuk error detail
    return NextResponse.json({ success: false, message: "Server Error", error: error.message }, { status: 500 });
  }
}
