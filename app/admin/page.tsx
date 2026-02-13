/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { FileText, Activity, ExternalLink, Calendar, Zap, Plus, HeartPulse, ArrowRight, Users, TrendingUp } from "lucide-react";

// --- INTERFACE ---
interface Article {
  _id: string;
  title: string;
  category: string;
  date: string;
  image: string;
}

interface DassResult {
  _id: string;
  name: string;
  age: number;
  depressionLevel: string;
  anxietyLevel: string;
  stressLevel: string;
  createdAt?: string; // Kasih tanda tanya (optional) biar gak error kalau kosong
}

// --- KOMPONEN BENTO CARD ---
const BentoCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`relative group overflow-hidden rounded-3xl border border-white/10 bg-[#141414]/60 backdrop-blur-xl p-6 transition-all hover:border-white/20 hover:shadow-2xl hover:shadow-violet-900/10 ${className}`}>
      <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-transparent rounded-3xl" />
      </div>
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </div>
  );
};

// --- HELPER BADGE LEVEL ---
const SeverityBadge = ({ label, level }: { label: string; level: string }) => {
  let color = "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";
  if (level === "Ringan") color = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  if (level === "Sedang") color = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
  if (level === "Parah") color = "bg-orange-500/10 text-orange-400 border-orange-500/20";
  if (level === "Sangat Parah") color = "bg-rose-500/10 text-rose-500 border-rose-500/20";

  return (
    <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${color} uppercase tracking-wider flex items-center gap-1`}>
      <span className="opacity-70">{label}:</span> {level}
    </span>
  );
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [recentTests, setRecentTests] = useState<DassResult[]>([]);

  // State Statistik
  const [stats, setStats] = useState({
    totalArticles: 0,
    categories: 0,
    totalTests: 0,
  });

  const [categoryDistribution, setCategoryDistribution] = useState<{ name: string; count: number; percentage: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articleRes, dassRes] = await Promise.all([axios.get("/api/article"), axios.get("/api/dass")]);

        // --- 1. OLAH DATA ARTIKEL ---
        if (articleRes.data.success) {
          const articles: Article[] = articleRes.data.articles;
          const totalDocs = articles.length;

          // Safety Sort: Cek dulu tanggalnya ada gak
          const sortedArticles = [...articles].sort((a, b) => {
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            return dateB - dateA;
          });
          setRecentArticles(sortedArticles.slice(0, 5));

          const catCounts: Record<string, number> = {};
          articles.forEach((art) => {
            const catName = art.category ? art.category.trim() : "Uncategorized";
            catCounts[catName] = (catCounts[catName] || 0) + 1;
          });

          const uniqueCategories = Object.keys(catCounts).length;
          const catDist = Object.entries(catCounts)
            .map(([name, count]) => ({
              name,
              count,
              percentage: Math.round((count / totalDocs) * 100),
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

          setCategoryDistribution(catDist);
          setStats((prev) => ({ ...prev, totalArticles: totalDocs, categories: uniqueCategories }));
        }

        // --- 2. OLAH DATA DASS (USER) ---
        if (dassRes.data) {
          const tests: DassResult[] = dassRes.data.data || dassRes.data.results || [];

          // SAFETY SORT: Kalau createdAt kosong, anggap 0 (paling lama)
          const sortedTests = [...tests].sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          });

          setRecentTests(sortedTests.slice(0, 5));
          setStats((prev) => ({ ...prev, totalTests: tests.length }));
        }
      } catch (error) {
        console.error("Gagal load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const today = new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen w-full text-white p-4 md:p-8 font-sans bg-transparent">
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Dashboard <span className="text-xs font-bold text-violet-400 bg-violet-500/10 px-2 py-1 rounded border border-violet-500/20 uppercase tracking-wider">Admin</span>
            </h1>
            <p className="text-neutral-400 mt-2 flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-violet-500" /> {today}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-[#1A1D25] border border-white/10 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:border-white/20 transition-all">
              <ExternalLink className="w-4 h-4" /> Web Utama
            </Link>
            <Link href="/admin/addArticle" className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-neutral-200 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              <Plus className="w-4 h-4" /> Artikel Baru
            </Link>
          </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <BentoCard>
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
                <FileText size={20} />
              </div>
              <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">LIVE</span>
            </div>
            <div className="mt-auto">
              <h3 className="text-4xl font-bold text-white tracking-tight">{loading ? "-" : stats.totalArticles}</h3>
              <p className="text-sm text-neutral-400 mt-1 font-medium">Artikel Terbit</p>
            </div>
          </BentoCard>

          <BentoCard className="bg-gradient-to-br from-violet-900/20 to-transparent border-violet-500/20">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-violet-500/10 rounded-xl border border-violet-500/20 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                <Users size={20} />
              </div>
              <Link href="/admin/dassList" className="text-[10px] font-bold text-violet-400 hover:text-white flex items-center gap-1 transition-colors">
                DETAIL <ArrowRight size={10} />
              </Link>
            </div>
            <div className="mt-auto relative">
              <div className="absolute right-0 bottom-0 opacity-10 text-violet-500 scale-150 translate-y-2 translate-x-2">
                <HeartPulse size={60} />
              </div>
              <h3 className="text-4xl font-bold text-white tracking-tight">{loading ? "-" : stats.totalTests}</h3>
              <p className="text-sm text-violet-200/70 mt-1 font-medium">Total Partisipan Tes</p>
            </div>
          </BentoCard>

          <BentoCard>
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
                <Zap size={20} />
              </div>
            </div>
            <div className="mt-auto">
              <h3 className="text-4xl font-bold text-white tracking-tight">{loading ? "-" : stats.categories}</h3>
              <p className="text-sm text-neutral-400 mt-1 font-medium">Topik Aktif</p>
            </div>
          </BentoCard>

          <BentoCard className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50">
            <div className="h-full flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2 text-fuchsia-400 text-xs font-bold uppercase tracking-wider">
                <TrendingUp size={14} /> Insight
              </div>
              <p className="text-sm text-neutral-300 italic leading-relaxed">
                "Kategori <span className="text-white font-bold not-italic">Stress</span> memiliki pencarian tertinggi bulan ini. Pertimbangkan membuat artikel terkait."
              </p>
            </div>
          </BentoCard>
        </div>

        {/* --- MAIN CONTENT (Bento Grid) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* TABEL 1: HASIL TES TERBARU */}
            <BentoCard className="min-h-[300px] p-0">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity size={18} className="text-violet-500" /> Aktivitas User Terbaru
                </h3>
                <Link href="/admin/dassList" className="text-xs font-bold text-violet-400 hover:text-white transition-colors">
                  Lihat Semua
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-neutral-400">
                  <thead className="bg-white/5 text-xs uppercase font-bold text-neutral-500">
                    <tr>
                      <th className="px-6 py-4">Nama</th>
                      <th className="px-6 py-4">Hasil Analisis</th>
                      <th className="px-6 py-4 text-right">Waktu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentTests.length > 0 ? (
                      recentTests.map((test) => (
                        <tr key={test._id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 font-medium text-white">
                            {test.name} <span className="text-neutral-600 text-xs font-normal">({test.age}th)</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                              <SeverityBadge label="D" level={test.depressionLevel} />
                              <SeverityBadge label="A" level={test.anxietyLevel} />
                              <SeverityBadge label="S" level={test.stressLevel} />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-xs font-mono text-neutral-500">
                            {/* SAFETY CHECK: Jika createdAt ada, format tanggal. Jika tidak, strip. */}
                            {test.createdAt ? new Date(test.createdAt).toLocaleDateString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-xs">
                          Belum ada data tes.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </BentoCard>

            {/* TABEL 2: ARTIKEL TERBARU */}
            <BentoCard className="min-h-[300px] p-0">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText size={18} className="text-blue-500" /> Artikel Terbit
                </h3>
                <Link href="/admin/articlesList" className="text-xs font-bold text-blue-400 hover:text-white transition-colors">
                  Lihat Semua
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <tbody className="divide-y divide-white/5">
                    {recentArticles.length > 0 ? (
                      recentArticles.map((item) => (
                        <tr key={item._id} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-lg bg-neutral-800 overflow-hidden shrink-0 border border-white/10">
                                <Image src={item.image || "/images/placeholder.jpg"} alt="t" fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <div>
                                <div className="font-bold text-neutral-200 group-hover:text-white transition-colors line-clamp-1">{item.title}</div>
                                <div className="text-xs text-neutral-500">{item.category}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-neutral-500 text-xs font-mono">
                            {/* SAFETY CHECK ARTIKEL JUGA */}
                            {item.date ? new Date(item.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="p-8 text-center text-xs">
                          Belum ada artikel.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </BentoCard>
          </div>

          {/* KOLOM 2 (KANAN): DISTRIBUSI & INFO */}
          <div className="flex flex-col gap-6">
            <BentoCard className="h-full">
              <h3 className="text-lg font-bold text-white mb-6">Distribusi Konten</h3>
              <div className="space-y-6">
                {categoryDistribution.map((cat, idx) => (
                  <div key={idx} className="group">
                    <div className="flex justify-between text-xs font-bold mb-2 text-neutral-400 group-hover:text-white transition-colors uppercase tracking-wider">
                      <span>{cat.name}</span>
                      <span className="font-mono text-white">{cat.percentage}%</span>
                    </div>
                    <div className="w-full bg-[#1A1D25] rounded-full h-2 overflow-hidden border border-white/5">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 relative shadow-[0_0_10px_rgba(255,255,255,0.2)] bg-gradient-to-r ${
                          idx === 0 ? "from-violet-600 to-indigo-600" : idx === 1 ? "from-fuchsia-600 to-pink-600" : idx === 2 ? "from-blue-600 to-cyan-600" : "from-neutral-500 to-neutral-400"
                        }`}
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
                {categoryDistribution.length === 0 && !loading && (
                  <div className="text-center py-10 opacity-30">
                    <Activity size={40} className="mx-auto mb-2" />
                    <p className="text-xs">Belum ada data kategori.</p>
                  </div>
                )}
              </div>
            </BentoCard>

            <BentoCard className="bg-emerald-900/10 border-emerald-500/20">
              <div className="flex items-center gap-3">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </div>
                <div>
                  <div className="text-sm font-bold text-emerald-400">System Online</div>
                  <div className="text-[10px] text-emerald-200/50">Response time: 12ms</div>
                </div>
              </div>
            </BentoCard>
          </div>
        </div>
      </div>
    </div>
  );
}
