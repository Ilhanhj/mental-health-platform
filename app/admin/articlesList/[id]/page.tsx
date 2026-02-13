/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import TiptapEditor from "@/components/TiptapEditor";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import { UploadCloud, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Kita gunakan 'any' untuk params biar aman dari error TypeScript Next.js 15
export default function EditArticlePage({ params }: { params: any }) {
  const router = useRouter();
  const [articleId, setArticleId] = useState<string | null>(null);
  const [image, setImage] = useState<File | string | null>(null);
  const [loading, setLoading] = useState(false); // State loading biar tombol gak dipencet 2x

  const [data, setData] = useState({
    title: "",
    description: "",
    category: "Mental Health",
    author: "",
  });

  // 1. UNWRAP PARAMS (Cara Aman)
  useEffect(() => {
    Promise.resolve(params).then((resolvedParams) => {
      setArticleId(resolvedParams.id);
    });
  }, [params]);

  // 2. FETCH DATA LAMA
  useEffect(() => {
    if (!articleId) return;

    const fetchOldData = async () => {
      try {
        const response = await axios.get("/api/article");
        if (response.data.success) {
          const article = response.data.articles.find((item: any) => item._id === articleId);
          if (article) {
            setData({
              title: article.title,
              description: article.description,
              category: article.category,
              author: article.author,
            });
            setImage(article.image);
          }
        }
      } catch (error) {
        toast.error("Gagal mengambil data lama.");
      }
    };
    fetchOldData();
  }, [articleId]);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleId) return;

    setLoading(true); // Mulai Loading

    try {
      const formData = new FormData();
      formData.append("id", articleId);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("author", data.author);

      // Logika Gambar: Hanya kirim jika user upload FILE baru
      if (typeof image === "object" && image !== null) {
        formData.append("image", image);
      }

      const response = await axios.put("/api/article", formData);

      if (response.data.success) {
        toast.success(response.data.message);
        router.push("/admin/articlesList");
      } else {
        toast.error("Gagal update artikel");
      }
    } catch (error: any) {
      console.error("Error submit:", error);
      toast.error("Server Error: Cek Terminal VS Code");
    } finally {
      setLoading(false); // Selesai Loading
    }
  };

  if (!articleId) return <div className="p-10 text-center text-black dark:text-white">Loading...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto pb-10 px-4">
      <Link href="/admin/articlesList" className="flex items-center gap-2 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300 mb-5 transition-colors">
        <ArrowLeft size={20} /> Kembali
      </Link>

      <h1 className="text-2xl font-bold mb-8 text-neutral-800 dark:text-white">Edit Artikel</h1>

      <form onSubmit={onSubmitHandler} className="flex flex-col gap-6">
        {/* GAMBAR */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">Thumbnail</p>
          <label htmlFor="image" className="cursor-pointer group">
            <div className="relative w-full h-64 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 group-hover:border-violet-500 transition-all">
              {image ? (
                <Image src={typeof image === "string" ? image : URL.createObjectURL(image)} alt="Preview" fill className="object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-500">Loading Image...</div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity text-white font-medium">
                <UploadCloud className="mr-2" /> Ganti Gambar
              </div>
            </div>
          </label>
          <input type="file" id="image" hidden onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} />
        </div>

        {/* INPUT: Tambahkan 'text-neutral-900 dark:text-white' agar tulisan kelihatan */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">Judul Artikel</p>
          <input
            name="title"
            value={data.title}
            onChange={onChangeHandler}
            type="text"
            className="w-full p-4 rounded-lg bg-gray-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
            required
          />
        </div>

        {/* --- INPUT DESCRIPTION (TIPTAP) --- */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">Isi Artikel</p>

          {/* Pastikan Editor cuma muncul kalau datanya sudah ada, biar gak numpuk/error */}
          {articleId && <TiptapEditor content={data.description} onChange={(html) => setData({ ...data, description: html })} />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">Kategori</p>
            <select
              name="category"
              onChange={onChangeHandler}
              value={data.category}
              className="w-full p-4 rounded-lg bg-gray-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
            >
              <option value="Mental Health">Mental Health</option>
              <option value="Academic Stress">Academic Stress</option>
              <option value="Self Improvement">Self Improvement</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">Penulis</p>
            <input
              name="author"
              value={data.author}
              onChange={onChangeHandler}
              type="text"
              className="w-full p-4 rounded-lg bg-gray-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
              required
            />
          </div>
        </div>

        {/* TOMBOL POJOK KANAN & CURSOR POINTER */}
        <div className="flex justify-end w-full mt-4 pb-10">
          <button type="submit" disabled={loading} className="w-40 bg-black dark:bg-white text-white dark:text-black font-bold py-4 rounded-full hover:opacity-80 transition-opacity cursor-pointer shadow-lg disabled:opacity-50">
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
