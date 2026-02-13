"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Mail, Trash2, Copy, Plus, Search, Calendar, CheckCircle2, Users } from "lucide-react";

// --- KOMPONEN BENTO CARD ---
const BentoCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`relative overflow-hidden rounded-3xl border border-white/10 bg-[#141414] p-6 backdrop-blur-md transition-all ${className}`}>
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </div>
  );
};

export default function EmailsListPage() {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const [search, setSearch] = useState("");

  // FETCH DATA
  const fetchEmails = async () => {
    try {
      const response = await axios.get("/api/email");
      if (response.data.success) {
        setEmails(response.data.emails);
      }
    } catch (error) {
      toast.error("Gagal memuat data email");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  // DELETE EMAIL
  const handleDelete = async (id: string) => {
    if (confirm("Hapus subscriber ini?")) {
      try {
        const response = await axios.delete(`/api/email`, { params: { id } });
        if (response.data.success) {
          toast.success("Email dihapus");
          fetchEmails();
        }
      } catch (error) {
        toast.error("Gagal menghapus");
      }
    }
  };

  // TAMBAH MANUAL
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    try {
      const response = await axios.post("/api/email", { email: emailInput });
      if (response.data.success) {
        toast.success("Subscriber baru ditambahkan");
        setEmailInput("");
        fetchEmails();
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      toast.error("Gagal menambahkan email");
    }
  };

  // COPY SATU EMAIL
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Email disalin ke clipboard! 📋");
  };

  // COPY SEMUA
  const handleCopyAll = () => {
    const allEmails = emails.map((e) => e.email).join(", ");
    navigator.clipboard.writeText(allEmails);
    toast.success(`${emails.length} email disalin! Siap dipaste.`);
  };

  // FILTER
  const filteredEmails = emails.filter((item) => item.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-full min-h-screen p-4 md:p-8 space-y-6 font-sans text-neutral-200">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-indigo-400">
              <Mail size={24} />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Manajemen Subscriber</h1>
          </div>
          <p className="text-neutral-500 text-sm">Kelola daftar email pengguna yang berlangganan newsletter.</p>
        </div>

        <div className="flex gap-3">
          {/* Search Input */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 size-4 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Cari email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 rounded-lg border border-white/10 bg-[#1A1D25] text-sm w-full md:w-64 text-neutral-200 focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all placeholder:text-neutral-600"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- KOLOM KIRI: INPUT FORM --- */}
        <div className="space-y-6">
          <BentoCard>
            <h3 className="text-sm font-bold text-neutral-400 uppercase mb-4 flex items-center gap-2">
              <Plus size={14} /> Tambah Manual
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase">Alamat Email</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full bg-[#1A1D25] border border-white/10 text-neutral-200 text-sm rounded-xl py-3 px-4 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  required
                />
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-white text-black hover:bg-neutral-200 rounded-xl text-sm font-bold transition-all shadow-lg shadow-white/5">
                <Plus size={16} /> Tambahkan
              </button>
            </form>
          </BentoCard>

          {/* Quick Stats */}
          <BentoCard className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-500/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500 rounded-full text-white shadow-lg shadow-indigo-500/40">
                <Users size={20} />
              </div>
              <div>
                <p className="text-xs text-indigo-300 font-bold uppercase">Total Subscriber</p>
                <p className="text-2xl font-bold text-white">{emails.length}</p>
              </div>
            </div>
          </BentoCard>
        </div>

        {/* --- KOLOM KANAN: LIST EMAIL --- */}
        <div className="lg:col-span-2">
          <BentoCard className="min-h-[500px] p-0 overflow-hidden flex flex-col">
            {/* Header Table */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
              <h3 className="text-sm font-bold text-neutral-300">Daftar Email</h3>
              <button onClick={handleCopyAll} className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors">
                <Copy size={12} /> Copy Semua
              </button>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-3 border-b border-white/5 bg-[#1A1D25]/50 text-xs font-bold text-neutral-500 uppercase tracking-wider">
              <div className="col-span-7 pl-2">Email Address</div>
              <div className="col-span-3">Tanggal</div>
              <div className="col-span-2 text-right pr-2">Aksi</div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-48 text-neutral-600 space-y-2">
                  <div className="h-5 w-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                  <p className="text-xs">Memuat...</p>
                </div>
              ) : filteredEmails.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-neutral-600">
                  <Mail size={24} className="opacity-20 mb-2" />
                  <p className="text-xs">Belum ada subscriber.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {filteredEmails.map((item) => (
                    <div key={item._id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/[0.02] transition-colors group text-sm">
                      {/* Kolom Email */}
                      <div className="col-span-7 pl-2 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-neutral-800 border border-white/5 flex items-center justify-center text-neutral-400 shrink-0">
                          <Mail size={14} />
                        </div>
                        <span className="font-mono text-neutral-300 truncate">{item.email}</span>
                        <button onClick={() => handleCopy(item.email)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-white/10 text-neutral-500 hover:text-white transition-all" title="Copy Email">
                          <Copy size={12} />
                        </button>
                      </div>

                      {/* Kolom Tanggal */}
                      <div className="col-span-3 text-neutral-500 text-xs flex items-center gap-2">
                        <Calendar size={12} />
                        {new Date(item.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "2-digit",
                        })}
                      </div>

                      {/* Kolom Aksi */}
                      <div className="col-span-2 text-right pr-2">
                        <button onClick={() => handleDelete(item._id)} className="p-2 rounded-lg text-neutral-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100" title="Hapus Subscriber">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </BentoCard>
        </div>
      </div>
    </div>
  );
}
