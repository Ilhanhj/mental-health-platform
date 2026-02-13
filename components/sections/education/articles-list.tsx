"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";

// Definisi Tipe Data (Disesuaikan dengan MongoDB)
interface ArticleProps {
  _id: string; // MongoDB pakai string _id, bukan number id
  title: string;
  description: string;
  image: string; // URL string dari upload
  date: string; // API mengembalikan date string
  category: string;
  author: string;
  author_img: string;
}

export default function EducationList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  // 1. State untuk Data Real & Loading
  const [articles, setArticles] = useState<ArticleProps[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Fetch Data dari API saat halaman dibuka
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("/api/article");
        if (response.data.success) {
          setArticles(response.data.articles);
        }
      } catch (error) {
        console.error("Gagal mengambil artikel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // 3. Ambil kategori unik dari DATA REAL
  const categories = ["Semua", ...Array.from(new Set(articles.map((item) => item.category)))];

  // 4. Logic Filter (Tetap sama, cuma variabel sumbernya diganti jadi 'articles')
  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "Semua" || article.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* HEADER SECTION */}
      <div className="relative border-b border-neutral-200 bg-neutral-50/50 py-16 dark:border-neutral-800 dark:bg-neutral-900/20">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-5xl">Pusat Edukasi Mental</h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">Kumpulan artikel, tips praktis, dan panduan kesehatan mental.</p>

          {/* Search Bar */}
          <div className="mx-auto flex max-w-md items-center rounded-full border border-neutral-200 bg-white px-4 py-2 shadow-sm focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 dark:border-neutral-800 dark:bg-neutral-900">
            <Search className="mr-3 size-5 text-neutral-400" />
            <input type="text" placeholder="Cari topik..." className="w-full bg-transparent text-sm outline-hidden dark:text-white placeholder:text-neutral-400" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          {/* Category Filter */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                  activeCategory === cat
                    ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GRID SECTION */}
      <div className="container mx-auto max-w-7xl px-4 py-16">
        {/* TAMPILAN LOADING */}
        {loading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-gray-100 dark:bg-neutral-900 animate-pulse"></div>
            ))}
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-full bg-neutral-100 p-4 dark:bg-neutral-900">
              <Search className="size-8 text-neutral-400" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Tidak ditemukan</h3>
          </div>
        )}
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

const ArticleCard = ({ article }: { article: ArticleProps }) => {
  // PENTING: Kita ganti Slug jadi ID biar gampang fetch detailnya nanti
  // Kalau mau pakai slug judul (SEO friendly), backend harus support search by slug.
  // Untuk skripsi biar cepat & aman, pakai ID dulu.
  const detailLink = `/education/${article._id}`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-950/50">
      {/* Gambar Wrapper */}
      <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10 z-10" />
        <Image src={article.image ? article.image : "/images/default_thumbnail.png"} alt={article.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
        <span className="absolute left-4 top-4 z-20 rounded-md bg-white/90 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-violet-600 backdrop-blur-sm dark:bg-black/80 dark:text-violet-400">{article.category}</span>
      </div>

      {/* Konten */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            <span>{formatDate(article.date)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-500 hover:text-violet-600 transition-colors">
            {/* Author Img: Pakai fallback kalau null */}
            <div className="relative size-4 overflow-hidden rounded-full border border-neutral-200">
              <Image src={article.author_img || "/profile_icon.png"} alt={article.author || "Gambar Penulis"} fill className="object-cover" />
            </div>
            <span>{article.author}</span>
          </div>
        </div>

        {/* Link Judul */}
        <Link href={detailLink} className="mb-3 block">
          <h3 className="text-xl font-bold leading-tight text-neutral-900 transition-colors group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400">{article.title}</h3>
        </Link>

        {/* Description: Strip HTML tags jika ada */}
        <p className="mb-6 flex-1 text-sm leading-relaxed text-neutral-600 line-clamp-3 dark:text-neutral-400">{(article.description || "").replace(/<[^>]*>?/gm, "")}</p>
        {/* Link Tombol */}
        <div className="mt-auto border-t border-neutral-100 pt-4 dark:border-neutral-800">
          <Link href={detailLink} className="flex items-center gap-2 text-sm font-semibold text-violet-600 transition-all hover:gap-3 dark:text-violet-400">
            Baca Selengkapnya
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
