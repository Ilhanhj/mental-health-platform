"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios"; // 1. Import Axios
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { BrainCircuit, Coffee, HeartHandshake, Sparkles } from "lucide-react";

// Definisi Tipe Data Artikel
interface ArticleProps {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  author: string;
}

export function ArticlesSection() {
  const [articles, setArticles] = useState<ArticleProps[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Fetch Data dari API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("/api/article");
        if (response.data.success) {
          setArticles(response.data.articles);
        }
      } catch (error) {
        console.error("Gagal load artikel preview:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Ambil 4 artikel terbaru saja
  // (Opsional: Kalau mau random, bisa di-shuffle dulu)
  // reverse() biar yang terbaru muncul di awal (kalau API sort by old)
  const featuredArticles = articles.slice(0, 4);

  const icons = [
    <BrainCircuit className="h-4 w-4 text-neutral-500" key="1" />,
    <Sparkles className="h-4 w-4 text-neutral-500" key="2" />,
    <Coffee className="h-4 w-4 text-neutral-500" key="3" />,
    <HeartHandshake className="h-4 w-4 text-neutral-500" key="4" />,
  ];

  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-neutral-950/50">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100 md:text-4xl">Eksplorasi Kesehatan Mental</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">Temukan berbagai cara untuk merawat pikiran dan jiwamu di tengah kesibukan kuliah.</p>
      </div>

      {loading ? (
        // Loading Skeleton Sederhana
        <div className="max-w-4xl mx-auto h-[500px] bg-gray-200 dark:bg-neutral-800 rounded-xl animate-pulse flex items-center justify-center text-gray-400">Memuat konten...</div>
      ) : featuredArticles.length > 0 ? (
        <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[22rem]">
          {featuredArticles.map((item, i) => {
            // 3. Logic Link (Pakai ID biar konsisten sama halaman detail)
            const detailLink = `/education/${item._id}`;

            // Layout Class (Biar selang-seling besar kecil)
            const gridClass = i === 0 || i === 3 ? "md:col-span-2" : "md:col-span-1";

            return (
              <BentoGridItem
                key={item._id}
                href={detailLink}
                className={`${gridClass} cursor-pointer transition-transform hover:scale-[1.02]`}
                title={item.title}
                // Strip HTML tags dari description biar rapi di preview
                description={(item.description || "").replace(/<[^>]*>?/gm, "")}
                header={<HeaderImage src={item.image} alt={item.title} />}
                icon={icons[i % icons.length]} // Rotasi icon
                category={item.category}
                author={item.author}
              />
            );
          })}
        </BentoGrid>
      ) : (
        <div className="text-center text-gray-500 py-10">Belum ada artikel yang diupload.</div>
      )}
    </section>
  );
}

// Component Image Helper
const HeaderImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden relative bg-neutral-100 dark:bg-neutral-900">
    <div className="absolute inset-0 bg-black/10 group-hover/bento:bg-black/0 transition-colors z-10" />
    <Image src={src ? src : "/images/default_thumbnail.png"} alt={alt} fill className="object-cover transition-transform duration-500 group-hover/bento:scale-105" />
  </div>
);
