"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShieldCheck, Users, Lightbulb, ArrowRight, Github, Linkedin, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
      {/* --- HERO SECTION: VISI & MISI --- */}
      <section className="relative overflow-hidden py-24 md:py-32">
        {/* Background Aurora Effect */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -left-20 top-0 h-[500px] w-[500px] rounded-full bg-violet-500/20 blur-[120px] dark:bg-violet-900/20" />
          <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-pink-500/20 blur-[120px] dark:bg-pink-900/20" />
        </div>

        <div className="container relative z-10 mx-auto max-w-5xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50/50 px-4 py-1.5 text-sm font-medium text-violet-700 backdrop-blur-md dark:border-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
            <Heart className="size-4 fill-violet-500 text-violet-500" />
            <span>Tentang MindCare UI</span>
          </div>

          <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl lg:leading-tight">
            Membangun Generasi Kampus yang <span className="text-violet-600 dark:text-violet-400">Lebih Sehat Mental</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            MindCare lahir dari kepedulian terhadap tingginya tingkat stres dan burnout di kalangan mahasiswa. Kami percaya bahwa kesehatan mental sama pentingnya dengan prestasi akademik.
          </p>
        </div>
      </section>

      {/* --- BENTO GRID: VALUES --- */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Card 1: The Problem (Dark Mode style accent) */}
            <div className="group md:col-span-2 relative overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-900 p-8 text-white shadow-xl transition-all hover:-translate-y-1 dark:border-neutral-800">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-violet-500/30 blur-3xl" />
              <div className="relative z-10">
                <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                  <Lightbulb className="size-6 text-yellow-300" />
                </div>
                <h3 className="mb-3 text-2xl font-bold">Mengapa MindCare?</h3>
                <p className="text-neutral-300 leading-relaxed">
                  Data menunjukkan bahwa 1 dari 3 mahasiswa mengalami gangguan kecemasan selama masa studi. Tugas menumpuk, skripsi, dan ketidakpastian masa depan menjadi pemicu utama. MindCare hadir sebagai teman bercerita yang aman,
                  privat, dan selalu ada 24/7 berbasis AI.
                </p>
              </div>
            </div>

            {/* Card 2: Privacy */}
            <div className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-violet-500/10 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-violet-100 p-3 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300">
                <ShieldCheck className="size-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-neutral-900 dark:text-white">Privasi Dijamin</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Curhat tanpa takut dihakimi. Semua percakapan Anda dengan AI terenkripsi dan anonim. Ruang aman Anda adalah prioritas kami.</p>
            </div>

            {/* Card 3: Community */}
            <div className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-pink-500/10 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-pink-100 p-3 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300">
                <Users className="size-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-neutral-900 dark:text-white">Inklusif</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Dirancang untuk semua mahasiswa dari berbagai jurusan. Kami menyediakan artikel dan panduan yang relevan dengan kehidupan kampus.</p>
            </div>

            {/* Card 4: Technology (Wide) */}
            <div className="md:col-span-2 relative overflow-hidden rounded-3xl border border-neutral-200 bg-gradient-to-br from-violet-50 to-pink-50 p-8 shadow-lg dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-900">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <h3 className="mb-2 text-xl font-bold text-neutral-900 dark:text-white">Didukung Teknologi Terkini</h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Aplikasi ini dibangun menggunakan <strong>Next.js 14</strong>, <strong>Tailwind CSS</strong>, dan integrasi <strong>AI LLM</strong> untuk memberikan respons yang empatik dan kontekstual. Proyek ini merupakan implementasi
                    nyata dari penelitian skripsi Teknik Informatika.
                  </p>
                </div>
                {/* Visual Tech Stack Decor */}
                <div className="flex gap-4 opacity-80 grayscale transition-all duration-500 hover:grayscale-0">
                  {/* Kamu bisa ganti ini dengan logo Nextjs/React nanti */}
                  <div className="size-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xs font-bold dark:bg-neutral-800">Next.js</div>
                  <div className="size-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xs font-bold dark:bg-neutral-800">React</div>
                  <div className="size-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xs font-bold dark:bg-neutral-800">AI</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CREATOR SECTION (Personal Branding Skripsi) --- */}
      <section className="py-24">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-12 text-3xl font-bold text-neutral-900 dark:text-white">Di Balik Layar</h2>

          <div className="relative mx-auto flex max-w-2xl flex-col items-center overflow-hidden rounded-3xl border border-neutral-200 bg-white p-8 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            {/* Profile Image Wrapper */}
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-500 to-pink-500 blur-lg opacity-50" />
              <img
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=300&auto=format&fit=crop"
                alt="Creator Profile"
                className="relative size-32 rounded-full border-4 border-white object-cover dark:border-neutral-800"
              />
            </div>

            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">Nama Mahasiswa</h3>
            <p className="mb-4 font-medium text-violet-600 dark:text-violet-400">Teknik Informatika - Angkatan 2021</p>

            <p className="mb-8 text-center text-neutral-600 dark:text-neutral-400">
              `MindCare adalah wujud dedikasi saya dalam menggabungkan teknologi dan kemanusiaan. Saya berharap platform ini bisa menjadi langkah kecil untuk membantu teman-teman mahasiswa yang sedang berjuang sendirian.`
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              <SocialLink href="#" icon={<Github className="size-5" />} />
              <SocialLink href="#" icon={<Linkedin className="size-5" />} />
              <SocialLink href="#" icon={<Instagram className="size-5" />} />
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA FOOTER --- */}
      <section className="pb-24 pt-12 px-4">
        <div className="container mx-auto max-w-5xl overflow-hidden rounded-3xl bg-neutral-900 px-6 py-16 text-center shadow-2xl dark:bg-white">
          <h2 className="mb-4 text-3xl font-bold text-white dark:text-neutral-900 md:text-4xl">Siap Memulai Perjalananmu?</h2>
          <p className="mx-auto mb-8 max-w-xl text-neutral-400 dark:text-neutral-600">Tidak perlu menunggu sampai merasa `parah`. Merawat kesehatan mental bisa dimulai dari sekarang, langkah demi langkah.</p>
          <Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-neutral-900 transition-transform hover:scale-105 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-white">
            Buat Akun Gratis
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

// --- HELPER COMPONENT ---
function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex size-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-colors hover:bg-violet-600 hover:text-white dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-violet-600"
    >
      {icon}
    </Link>
  );
}
