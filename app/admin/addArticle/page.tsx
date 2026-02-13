"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, UploadCloud, Save, Image as ImageIcon, Type, User, Layout, Bold, Italic, List, AlignLeft, Link as LinkIcon } from "lucide-react";
import { useRouter } from "next/navigation";

// --- KOMPONEN BENTO CARD ---
const BentoCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`relative overflow-hidden rounded-3xl border border-white/10 bg-[#141414] p-6 backdrop-blur-md transition-all ${className}`}>
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </div>
  );
};

export default function AddArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // State Form
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Mental Health",
    author: "Admin MindCare",
    image: "",
  });

  const [previewImg, setPreviewImg] = useState<string | null>(null);

  // Handle Input Text
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Image Upload
  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Convert to Base64 (Simpel buat demo/skripsi)
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImg(base64String);
        setFormData((prev) => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Handler
  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/article", formData);
      if (response.data.success) {
        toast.success("Artikel berhasil diterbitkan! 🎉");
        setFormData({ title: "", content: "", category: "Mental Health", author: "Admin", image: "" });
        setPreviewImg(null);
        setTimeout(() => router.push("/admin/articlesList"), 1500);
      } else {
        toast.error("Gagal menerbitkan artikel");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="w-full min-h-screen p-4 md:p-8 space-y-6 font-sans text-neutral-200">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div className="flex items-center gap-4">
          <Link href="/admin/articlesList" className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Tulis Artikel Baru</h1>
            <p className="text-neutral-500 text-sm">Bagikan wawasan kesehatan mental kepada mahasiswa.</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(124,58,237,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>Loading...</>
            ) : (
              <>
                <Save size={16} /> Terbitkan
              </>
            )}
          </button>
        </div>
      </div>

      {/* --- MAIN GRID LAYOUT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- KOLOM KIRI (EDITOR AREA) --- */}
        <div className="lg:col-span-2 space-y-6">
          {/* Input Judul & Konten */}
          <BentoCard className="min-h-[500px]">
            {/* Judul Artikel */}
            <div className="mb-6">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={onChangeHandler}
                placeholder="Judul Artikel..."
                className="w-full bg-transparent text-3xl md:text-4xl font-bold text-white placeholder-neutral-700 border-none outline-none focus:ring-0 px-0"
                required
              />
            </div>

            {/* Toolbar Dummy (Visual Only) */}
            <div className="flex items-center gap-1 mb-4 p-2 bg-[#1A1D25] border border-white/5 rounded-lg w-max">
              <button type="button" className="p-2 hover:bg-white/10 rounded text-neutral-400 hover:text-white transition-colors">
                <Bold size={16} />
              </button>
              <button type="button" className="p-2 hover:bg-white/10 rounded text-neutral-400 hover:text-white transition-colors">
                <Italic size={16} />
              </button>
              <div className="w-px h-4 bg-white/10 mx-1"></div>
              <button type="button" className="p-2 hover:bg-white/10 rounded text-neutral-400 hover:text-white transition-colors">
                <List size={16} />
              </button>
              <button type="button" className="p-2 hover:bg-white/10 rounded text-neutral-400 hover:text-white transition-colors">
                <AlignLeft size={16} />
              </button>
              <div className="w-px h-4 bg-white/10 mx-1"></div>
              <button type="button" className="p-2 hover:bg-white/10 rounded text-neutral-400 hover:text-white transition-colors">
                <LinkIcon size={16} />
              </button>
            </div>

            {/* Textarea Konten */}
            <textarea
              name="content"
              value={formData.content}
              onChange={onChangeHandler}
              placeholder="Mulai menulis cerita Anda di sini..."
              className="w-full h-[400px] bg-transparent text-neutral-300 text-lg leading-relaxed placeholder-neutral-700 border-none outline-none focus:ring-0 px-0 resize-none custom-scrollbar"
              required
            />
          </BentoCard>
        </div>

        {/* --- KOLOM KANAN (SETTINGS AREA) --- */}
        <div className="space-y-6">
          {/* 1. Thumbnail Upload */}
          <BentoCard>
            <h3 className="text-sm font-bold text-neutral-400 uppercase mb-4 flex items-center gap-2">
              <ImageIcon size={14} /> Thumbnail
            </h3>

            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-neutral-700 rounded-2xl cursor-pointer hover:border-violet-500/50 hover:bg-violet-500/5 transition-all group overflow-hidden relative">
              {previewImg ? (
                <Image src={previewImg} alt="Preview" fill className="object-cover rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="p-3 bg-neutral-800 rounded-full mb-3 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-6 h-6 text-neutral-400 group-hover:text-violet-400" />
                  </div>
                  <p className="mb-2 text-sm text-neutral-400 font-medium">Klik untuk upload</p>
                  <p className="text-xs text-neutral-600">SVG, PNG, JPG (Max 2MB)</p>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={onImageChange} />
            </label>
          </BentoCard>

          {/* 2. Detail Publikasi */}
          <BentoCard>
            <h3 className="text-sm font-bold text-neutral-400 uppercase mb-4 flex items-center gap-2">
              <Layout size={14} /> Detail Publikasi
            </h3>

            <div className="space-y-4">
              {/* Kategori */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase">Kategori</label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 size-4" />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={onChangeHandler}
                    className="w-full bg-[#1A1D25] border border-white/10 text-neutral-200 text-sm rounded-xl py-3 pl-10 pr-4 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 appearance-none cursor-pointer"
                  >
                    <option value="Mental Health">Mental Health (Umum)</option>
                    <option value="Depression">Depression</option>
                    <option value="Anxiety">Anxiety</option>
                    <option value="Stress">Stress</option>
                    <option value="Self Improvement">Self Improvement</option>
                    <option value="Tips & Trick">Tips & Trick</option>
                  </select>
                </div>
              </div>

              {/* Penulis */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase">Penulis</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 size-4" />
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={onChangeHandler}
                    placeholder="Nama Penulis"
                    className="w-full bg-[#1A1D25] border border-white/10 text-neutral-200 text-sm rounded-xl py-3 pl-10 pr-4 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50"
                  />
                </div>
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </form>
  );
}
