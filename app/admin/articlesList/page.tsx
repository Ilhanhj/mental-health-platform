"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
import { Edit, Trash2, Plus, Search, FileText, Eye, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

// --- KOMPONEN BENTO CARD (Reusable) ---
const BentoCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`relative overflow-hidden rounded-3xl border border-white/10 bg-[#141414] p-6 backdrop-blur-md transition-all ${className}`}>
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </div>
  );
};

export default function ArticlesListPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // FETCH DATA
  const fetchArticles = async () => {
    try {
      const response = await axios.get("/api/article");
      if (response.data.success) {
        setArticles(response.data.articles);
      } else {
        toast.error("Gagal mengambil data artikel");
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // DELETE ARTIKEL
  const handleDelete = async (id: string) => {
    if (window.confirm("Yakin ingin menghapus artikel ini?")) {
      try {
        const response = await axios.delete("/api/article", {
          params: { id },
        });
        if (response.data.success) {
          toast.success("Artikel berhasil dihapus");
          fetchArticles(); // Refresh list
        } else {
          toast.error("Gagal menghapus artikel");
        }
      } catch (error) {
        toast.error("Terjadi kesalahan server");
      }
    }
  };

  // FILTER SEARCH
  const filteredArticles = articles.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-full min-h-screen p-4 md:p-8 space-y-6 font-sans text-neutral-200">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-400">
              <FileText size={24} />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Daftar Artikel</h1>
          </div>
          <p className="text-neutral-500 text-sm">Kelola semua konten edukasi dan berita di sini.</p>
        </div>

        <div className="flex gap-3">
          {/* Search Input */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 size-4 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Cari judul atau kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 rounded-lg border border-white/10 bg-[#1A1D25] text-sm w-full md:w-64 text-neutral-200 focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-neutral-600"
            />
          </div>

          {/* Tombol Tambah */}
          <Link
            href="/admin/addArticle"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] active:scale-95"
          >
            <Plus size={16} /> <span className="hidden md:inline">Artikel Baru</span>
          </Link>
        </div>
      </div>

      {/* --- TABLE CONTENT (Grid Layout) --- */}
      <BentoCard className="min-h-[500px] p-0 overflow-hidden flex flex-col">
        {/* Header Grid */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-white/[0.02] text-xs font-bold text-neutral-500 uppercase tracking-wider">
          <div className="col-span-5 pl-2">Judul & Penulis</div>
          <div className="col-span-2">Kategori</div>
          <div className="col-span-3 text-right">Tanggal</div>
          <div className="col-span-2 text-right pr-2">Aksi</div>
        </div>

        {/* List Items */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-600 space-y-2">
              <div className="h-6 w-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-xs">Memuat artikel...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-600 border-dashed border border-white/5 m-4 rounded-xl bg-white/[0.01]">
              <p className="text-sm">Tidak ada artikel ditemukan.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredArticles.map((item) => (
                <div key={item._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center hover:bg-white/[0.02] transition-colors group">
                  {/* 1. Judul & Gambar */}
                  <div className="md:col-span-5 pl-2 flex items-center gap-4">
                    <div className="relative h-12 w-16 md:h-10 md:w-14 shrink-0 rounded-lg overflow-hidden bg-neutral-800 border border-white/5">
                      <Image src={item.image.startsWith("/") ? item.image : "/images/placeholder.jpg"} alt="thumb" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-neutral-200 text-sm truncate group-hover:text-white transition-colors pr-4">{item.title}</h3>
                      <p className="text-[11px] text-neutral-500 truncate">
                        Oleh: <span className="text-neutral-400">{item.author || "Admin"}</span>
                      </p>
                    </div>
                  </div>

                  {/* 2. Kategori */}
                  <div className="md:col-span-2 flex md:block">
                    <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border border-white/10 bg-[#1A1D25] text-neutral-400 group-hover:border-blue-500/30 group-hover:text-blue-400 transition-colors">
                      {item.category}
                    </span>
                  </div>

                  {/* 3. Tanggal */}
                  <div className="md:col-span-3 md:text-right text-neutral-500 text-xs font-mono">
                    {new Date(item.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>

                  {/* 4. Aksi Buttons */}
                  <div className="md:col-span-2 flex items-center md:justify-end gap-2 pr-2">
                    <Link
                      href={`/education/${item._id}`} // Asumsi link ke detail public
                      target="_blank"
                      className="p-2 rounded-lg text-neutral-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                      title="Lihat"
                    >
                      <Eye size={16} />
                    </Link>
                    <button className="p-2 rounded-lg text-neutral-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all" title="Edit">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="p-2 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all" title="Hapus">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Pagination */}
        <div className="border-t border-white/5 p-3 flex items-center justify-between bg-white/[0.02]">
          <p className="text-[10px] text-neutral-600 pl-2">Total {filteredArticles.length} artikel</p>
          <div className="flex gap-1">
            <button disabled className="p-1 rounded bg-white/5 text-neutral-600 disabled:opacity-30 hover:bg-white/10 transition-colors">
              <ChevronLeft size={14} />
            </button>
            <button disabled className="p-1 rounded bg-white/5 text-neutral-600 disabled:opacity-30 hover:bg-white/10 transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </BentoCard>
    </div>
  );
}
