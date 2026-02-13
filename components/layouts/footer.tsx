/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HeartPulse, Instagram, Twitter, Linkedin, Github, Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";

export default function Footer() {
  const [inputEmail, setInputEmail] = useState("");
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  // 1. Cek Admin (Ini sudah benar)
  if (pathname.startsWith("/admin")) {
    return null;
  }

  // 2. Fungsi Handle Submit
  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail) return;

    try {
      const response = await axios.post("/api/email", { email: inputEmail });
      if (response.data.success) {
        toast.success("Email berhasil ditambahkan!");
        setInputEmail("");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.msg || "Gagal menambah email");
    }
  }; // <--- STOP DISINI KURUNG KURAWALNYA

  // 3. Return HTML (HARUS DILUAR FUNGSI handleAddEmail)
  return (
    <footer className="relative border-t border-neutral-200 bg-neutral-50 pt-16 pb-8 text-sm dark:border-neutral-800 dark:bg-neutral-950">
      {/* --- BACKGROUND DECORATION (Subtle Glow) --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-900/10" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-pink-500/10 blur-3xl dark:bg-pink-900/10" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* 1. BRAND COLUMN */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 shadow-sm">
                <HeartPulse className="size-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">MindCare UI</span>
            </Link>
            <p className="max-w-xs text-neutral-600 dark:text-neutral-400">Platform edukasi dan deteksi dini kesehatan mental berbasis AI untuk mahasiswa Indonesia.</p>
            <div className="flex items-center gap-4 text-neutral-500 dark:text-neutral-400">
              <SocialLink href="#" icon={<Instagram className="size-5" />} />
              <SocialLink href="#" icon={<Twitter className="size-5" />} />
              <SocialLink href="#" icon={<Linkedin className="size-5" />} />
              <SocialLink href="#" icon={<Github className="size-5" />} />
            </div>
          </div>

          {/* 2. LINKS COLUMN (Product) */}
          <div>
            <h3 className="mb-4 font-bold text-neutral-900 dark:text-white">Platform</h3>
            <ul className="flex flex-col gap-3 text-neutral-600 dark:text-neutral-400">
              <FooterLink href="#">Tes Kesehatan Mental</FooterLink>
              <FooterLink href="#">Artikel Edukasi</FooterLink>
              <FooterLink href="#">Jurnal Harian</FooterLink>
              <FooterLink href="#">Konsultasi (Segera)</FooterLink>
            </ul>
          </div>

          {/* 3. LINKS COLUMN (Resources/Legal) */}
          <div>
            <h3 className="mb-4 font-bold text-neutral-900 dark:text-white">Dukungan</h3>
            <ul className="flex flex-col gap-3 text-neutral-600 dark:text-neutral-400">
              <FooterLink href="#">Tentang Kami</FooterLink>
              <FooterLink href="#">Pusat Bantuan</FooterLink>
              <FooterLink href="#">Privasi & Data</FooterLink>
              <FooterLink href="#">Syarat Ketentuan</FooterLink>
            </ul>
          </div>

          {/* 4. NEWSLETTER / CONTACT */}
          <div className="flex flex-col gap-4">
            <h3 className="mb-1 font-bold text-neutral-900 dark:text-white">Tetap Terhubung</h3>
            <p className="text-neutral-600 dark:text-neutral-400">Dapatkan tips kesehatan mental terbaru langsung ke inbox Anda.</p>
            <div className="flex flex-col gap-2">
              <div className="relative">
                <form onSubmit={handleAddEmail}>
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    placeholder="Email mahasiswa..."
                    className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-10 pr-4 text-sm outline-hidden focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                  />
                </form>
              </div>
              {/* Tombol dipisah biar rapi, atau mau digabung ke form juga boleh */}
              <button onClick={handleAddEmail} className="w-full rounded-lg bg-neutral-900 py-2 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200">
                Langganan
              </button>
            </div>
          </div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-neutral-200 pt-8 text-neutral-500 dark:border-neutral-800 md:flex-row">
          <p>© {currentYear} MindCare UI. Skripsi Project.</p>
          <div className="flex gap-6 text-xs font-medium">
            <Link href="#" className="hover:text-violet-600 dark:hover:text-violet-400">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-violet-600 dark:hover:text-violet-400">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// --- HELPER COMPONENTS ---

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="transition-colors hover:text-violet-600 hover:underline dark:hover:text-violet-400">
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="rounded-full bg-neutral-100 p-2 text-neutral-600 transition-colors hover:bg-violet-100 hover:text-violet-600 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-violet-900/30 dark:hover:text-violet-400">
      {icon}
    </Link>
  );
}
