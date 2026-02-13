"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { ArrowLeft, Calendar, Share2, Bookmark, User } from "lucide-react";
import { toast } from "react-toastify";

// --- HELPER FUNCTION ---
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Definisi Tipe Data
interface ArticleProps {
  _id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
  author: string;
  author_img: string;
}

const handleShare = () => {
  // Salin URL saat ini ke clipboard
  navigator.clipboard.writeText(window.location.href);
  toast.success("Link berhasil disalin! Siap dibagikan.");
};

export default function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // 1. UNWRAP PARAMS
  // Ingat: Di halaman List tadi linknya adalah /education/${_id}
  // Jadi 'slug' di sini sebenarnya adalah ID Artikel.
  const resolvedParams = use(params);
  const articleId = resolvedParams.slug;

  // 2. STATE
  const [article, setArticle] = useState<ArticleProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState<ArticleProps[]>([]);

  // 3. FETCH DATA API
  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        // Kita fetch semua dulu (solusi cepat), lalu cari yg ID-nya cocok
        // (Idealnya backend punya endpoint GET /api/article?id=..., tapi ini cukup buat skripsi)
        const response = await axios.get("/api/article");

        if (response.data.success) {
          const allArticles: ArticleProps[] = response.data.articles;

          // Cari artikel yang sedang dibuka
          const foundArticle = allArticles.find((item) => item._id === articleId);
          setArticle(foundArticle || null);

          // Ambil artikel lain untuk sidebar (exclude artikel yg sedang dibuka)
          const others = allArticles.filter((item) => item._id !== articleId).slice(0, 3);
          setRelatedArticles(others);
        }
      } catch (error) {
        console.error("Gagal load detail artikel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleData();
  }, [articleId]);

  // --- TAMPILAN LOADING ---
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 container mx-auto px-4 pt-10">
        <div className="animate-pulse space-y-4 max-w-4xl mx-auto">
          <div className="h-8 bg-gray-200 dark:bg-neutral-800 rounded w-3/4"></div>
          <div className="h-64 bg-gray-200 dark:bg-neutral-800 rounded-xl w-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  // --- TAMPILAN 404 (JIKA ID TIDAK KETEMU) ---
  if (!article) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center dark:bg-neutral-950">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white">404 - Artikel Tidak Ditemukan</h1>
        <p className="mb-6 mt-2 text-neutral-600 dark:text-neutral-400">
          Artikel dengan ID <span className="font-mono bg-neutral-100 px-2 py-1 rounded dark:bg-neutral-800">{articleId}</span> tidak ada di database.
        </p>
        <Link href="/education" className="rounded-full bg-violet-600 px-6 py-3 font-bold text-white hover:bg-violet-700">
          Kembali ke Daftar
        </Link>
      </div>
    );
  }

  // --- TAMPILAN UTAMA ---
  return (
    <div className="min-h-screen bg-white pb-20 dark:bg-neutral-950">
      {/* HEADER STICKY */}
      <div className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/education" className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-violet-600 dark:text-neutral-400">
            <ArrowLeft className="size-4" /> Kembali
          </Link>
          <div className="flex gap-2">
            <button className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <Bookmark className="size-5" />
            </button>
            <button
              onClick={handleShare} // <--- Pasang di sini
              className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Bagikan Artikel"
            >
              <Share2 className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="container mx-auto max-w-5xl px-4 pt-8">
        <div className="mb-6 flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 font-bold">
          {article.category} <span className="text-neutral-300 font-normal">/</span> <span className="text-neutral-500 font-normal">5 menit baca</span>
        </div>

        <h1 className="mb-6 text-3xl font-extrabold leading-tight text-neutral-900 dark:text-white md:text-5xl">{article.title}</h1>

        <div className="mb-8 flex items-center justify-between border-b border-neutral-100 pb-8 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="relative size-10 overflow-hidden rounded-full border border-neutral-200">
              {/* Gambar Author Fallback */}
              <Image src={article.author_img || "/profile_icon.png"} alt={article.author || "Gambar Penulis"} fill className="object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900 dark:text-white">{article.author}</p>
              <p className="text-xs text-neutral-500">Penulis</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-neutral-500">
            <Calendar className="size-4" /> {formatDate(article.date)}
          </div>
        </div>

        <div className="relative mb-12 aspect-[21/9] w-full overflow-hidden rounded-2xl shadow-lg bg-gray-100 dark:bg-neutral-900">
          <Image src={article.image ? article.image : "/images/default_thumbnail.png"} alt={article.title} fill className="object-cover" priority />
        </div>
      </div>

      {/* CONTENT & SIDEBAR */}
      <div className="container mx-auto grid max-w-5xl grid-cols-1 gap-12 px-4 lg:grid-cols-12">
        {/* ARTIKEL UTAMA */}
        {/* ARTIKEL UTAMA */}
        <article className="lg:col-span-8 space-y-6 text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
          {/* Gunakan dangerouslySetInnerHTML untuk merender HTML dari Tiptap */}
          <div className="article-content" dangerouslySetInnerHTML={{ __html: article.description }} />
        </article>

        {/* SIDEBAR (Related Articles) */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="sticky top-24">
            <h3 className="mb-4 font-bold text-neutral-900 dark:text-white">Artikel Lainnya</h3>
            <div className="flex flex-col gap-4">
              {relatedArticles.length > 0 ? (
                relatedArticles.map((item) => (
                  // Link pakai ID juga
                  <Link key={item._id} href={`/education/${item._id}`} className="flex gap-3 group">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                      <Image src={item.image ? item.image : "/images/default_thumbnail.png"} alt={item.title} fill className="object-cover transition-transform group-hover:scale-110" />
                    </div>
                    <div>
                      <h4 className="line-clamp-2 text-sm font-bold text-neutral-900 group-hover:text-violet-600 dark:text-white transition-colors">{item.title}</h4>
                      <span className="text-xs text-neutral-500 mt-1 block">{formatDate(item.date)}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-neutral-500">Belum ada artikel lain.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
