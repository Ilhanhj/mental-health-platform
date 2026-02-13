/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Trash2, Search, User, Activity, Download, ChevronLeft, ChevronRight, HeartPulse } from "lucide-react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

// --- KOMPONEN BENTO CARD ---
const BentoCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`relative overflow-hidden rounded-3xl border border-white/10 bg-[#141414] p-6 backdrop-blur-md transition-all ${className}`}>
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </div>
  );
};

export default function DassResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Tampilkan 10 data per halaman

  // FETCH DATA
  const fetchResults = async () => {
    try {
      const response = await axios.get("/api/dass");
      if (response.data.success) {
        // Sort by date descending (terbaru di atas)
        const sorted = (response.data.results || []).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setResults(sorted);
      }
    } catch (error) {
      console.error("Gagal ambil data", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  // DELETE DATA
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const response = await axios.delete(`/api/dass?id=${deleteId}`);
      if (response.data.success) {
        toast.success("Data berhasil dihapus");
        fetchResults();
        setIsModalOpen(false);
        setDeleteId(null);
      }
    } catch (error) {
      toast.error("Gagal menghapus data");
    }
  };

  // EXPORT CSV
  const handleExport = () => {
    if (!results || results.length === 0) {
      toast.warning("Belum ada data tes untuk diexport");
      return;
    }
    try {
      const headers = ["Nama,Umur,Tanggal,Skor Depresi,Level Depresi,Skor Cemas,Level Cemas,Skor Stres,Level Stres"];
      const rows = results.map((item: any) => {
        const date = item.date ? new Date(item.date).toLocaleDateString("id-ID") : "-";
        const cleanName = item.name ? item.name.replace(/,/g, " ") : "Anonim";
        return `${cleanName},${item.age || "-"},${date},${item.depressionScore},${item.depressionLevel},${item.anxietyScore},${item.anxietyLevel},${item.stressScore},${item.stressLevel}`;
      });
      const csvContent = [headers, ...rows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Laporan_Mental_Health_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("Gagal export CSV");
    }
  };

  // HELPER WARNA BADGE
  const getBadgeColor = (level: string) => {
    if (!level) return "border-gray-700 text-gray-400 bg-gray-900/50";
    const l = level.toLowerCase();
    if (l.includes("normal")) return "border-emerald-500/30 text-emerald-400 bg-emerald-500/10";
    if (l.includes("ringan")) return "border-yellow-500/30 text-yellow-400 bg-yellow-500/10";
    if (l.includes("sedang")) return "border-orange-500/30 text-orange-400 bg-orange-500/10";
    return "border-rose-500/30 text-rose-400 bg-rose-500/10 shadow-[0_0_10px_rgba(244,63,94,0.2)]";
  };

  // --- LOGIC PAGINATION & SEARCH ---
  const filteredResults = results.filter((item) => (item.name ? item.name.toLowerCase().includes(search.toLowerCase()) : false));

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

  // Ambil data slice sesuai halaman aktif
  const paginatedData = filteredResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Handle tombol prev/next
  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  // Reset ke halaman 1 jika search berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="w-full min-h-screen p-4 md:p-8 space-y-6 font-sans text-neutral-200">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-violet-500/10 rounded-lg border border-violet-500/20 text-violet-400">
              <HeartPulse size={24} />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Hasil Tes Mental</h1>
          </div>
          <p className="text-neutral-500 text-sm">Memantau data kesehatan mental mahasiswa dari tes DASS-21.</p>
        </div>

        <div className="flex gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 size-4 group-focus-within:text-violet-500 transition-colors" />
            <input
              type="text"
              placeholder="Cari nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 rounded-lg border border-white/10 bg-[#1A1D25] text-sm w-full md:w-64 text-neutral-200 focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500/50 outline-none transition-all placeholder:text-neutral-600"
            />
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-600/20 hover:border-emerald-500/40 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)]"
          >
            <Download size={16} /> <span className="hidden md:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* --- CONTENT TABLE --- */}
      <BentoCard className="min-h-[500px] p-0 overflow-hidden flex flex-col">
        {/* Header Tabel Custom */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-white/[0.02] text-xs font-bold text-neutral-500 uppercase tracking-wider sticky top-0 z-20 backdrop-blur-md">
          <div className="col-span-3 pl-2">Mahasiswa</div>
          <div className="col-span-2 text-center">Tanggal</div>
          <div className="col-span-2 text-center">Depresi</div>
          <div className="col-span-2 text-center">Kecemasan</div>
          <div className="col-span-2 text-center">Stres</div>
          <div className="col-span-1 text-right pr-2">Aksi</div>
        </div>

        {/* Isi Tabel */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-600 space-y-2">
              <Activity className="animate-spin text-violet-500/50" />
              <p className="text-xs">Mengambil data...</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-600 border-dashed border border-white/5 m-4 rounded-xl bg-white/[0.01]">
              <p className="text-sm">Data tidak ditemukan.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {/* RENDER DATA YANG SUDAH DIPAGINASI */}
              {paginatedData.map((item) => (
                <div key={item._id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/[0.02] transition-colors group text-sm">
                  {/* Kolom Nama */}
                  <div className="col-span-3 pl-2">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0 text-violet-400">
                        <User size={14} />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-200 group-hover:text-white transition-colors line-clamp-1">{item.name}</p>
                        <p className="text-[10px] text-neutral-600">Umur: {item.age || "-"} th</p>
                      </div>
                    </div>
                  </div>

                  {/* Kolom Tanggal */}
                  <div className="col-span-2 text-center text-neutral-500 font-mono text-xs">
                    {new Date(item.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "2-digit",
                    })}
                    <div className="text-[10px] opacity-50">{new Date(item.date).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</div>
                  </div>

                  {/* Skor & Badge */}
                  <div className="col-span-2 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getBadgeColor(item.depressionLevel)}`}>
                      {item.depressionLevel} <span className="opacity-60 ml-1">({item.depressionScore})</span>
                    </span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getBadgeColor(item.anxietyLevel)}`}>
                      {item.anxietyLevel} <span className="opacity-60 ml-1">({item.anxietyScore})</span>
                    </span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getBadgeColor(item.stressLevel)}`}>
                      {item.stressLevel} <span className="opacity-60 ml-1">({item.stressScore})</span>
                    </span>
                  </div>

                  {/* Aksi */}
                  <div className="col-span-1 text-right pr-2">
                    <button
                      onClick={() => {
                        setDeleteId(item._id);
                        setIsModalOpen(true);
                      }}
                      className="p-2 rounded-lg text-neutral-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                      title="Hapus Data"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- FOOTER PAGINATION --- */}
        <div className="border-t border-white/5 p-4 flex items-center justify-between bg-white/[0.02]">
          <p className="text-xs text-neutral-500 pl-2">
            Menampilkan <span className="text-white font-bold">{paginatedData.length}</span> dari <span className="text-white font-bold">{filteredResults.length}</span> data
          </p>

          <div className="flex items-center gap-2">
            {/* Tombol Previous */}
            <button onClick={handlePrev} disabled={currentPage === 1} className="p-2 rounded-lg bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronLeft size={16} />
            </button>

            {/* Info Halaman */}
            <span className="text-xs font-mono text-neutral-400 px-2">
              Halaman {currentPage} / {totalPages || 1}
            </span>

            {/* Tombol Next */}
            <button onClick={handleNext} disabled={currentPage >= totalPages} className="p-2 rounded-lg bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </BentoCard>

      <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleDelete} title="Hapus Data Tes?" message="Tindakan ini tidak dapat dibatalkan. Data akan hilang permanen dari database." />
    </div>
  );
}
