"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Star, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

// --- IMPORT GAMBAR (PNG) ---
import hero_main from "@/app/data/assets/hero_pic.png"; // Gambar Depan (Support)
import hero_sec from "@/app/data/assets/hero_pic_1.png"; // Gambar Belakang (Struggle) - Sudah PNG

export default function HeroSection() {
  const headline = "Kesehatan Mental Anda Adalah Prioritas Utama".split(" ");

  const floatingAnimation = (delay: number) => ({
    y: [-15, 15],
    transition: {
      duration: 5,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut",
      delay: delay,
    },
  });

  return (
    <div className="relative w-full overflow-hidden bg-[#F8F9FF] dark:bg-neutral-950 selection:bg-violet-500/30 pt-24 pb-12 lg:pt-32 lg:pb-20">
      {/* --- BACKGROUND AMBIENCE --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -right-[5%] h-[600px] w-[600px] rounded-full bg-violet-400/20 blur-[120px] dark:bg-violet-900/20" />
        <div className="absolute top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-pink-400/20 blur-[100px] dark:bg-pink-900/20" />
      </div>

      <div className="absolute inset-0 z-[5] opacity-40 dark:opacity-20 pointer-events-none">
        <BackgroundRippleEffect />
      </div>

      <div className="container relative z-20 mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* --- LEFT COLUMN: TEXT --- */}
          {/* PERBAIKAN: items-center & text-center (Mobile) -> items-start & text-left (Desktop) */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left relative z-20">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              // mx-auto untuk tengah di mobile, lg:mx-0 untuk kiri di desktop
              className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-1.5 backdrop-blur-md mb-6 dark:border-violet-800 dark:bg-neutral-900/80 shadow-xs mx-auto lg:mx-0"
            >
              <span className="flex size-2 relative">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-violet-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wide text-violet-700 dark:text-violet-300">#1 Mental Health Platform</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl mb-6 leading-[1.15] text-neutral-900 dark:text-white">
              {headline.map((word, index) => (
                <span key={index} className={index > 3 ? "text-violet-600 dark:text-violet-400" : ""}>
                  {word}{" "}
                </span>
              ))}
            </h1>

            {/* Description */}
            <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8 max-w-lg leading-relaxed mx-auto lg:mx-0">
              Jangan biarkan stres akademik menghambat potensimu. Kami hadir dengan teknologi AI untuk mendampingi perjalanan kesehatan mentalmu.
            </p>

            {/* Buttons */}
            {/* justify-center untuk mobile, justify-start untuk desktop */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10">
              <Link href="/test-mental">
                <button className="group relative flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-4 text-base font-bold text-white shadow-lg shadow-violet-500/20 transition-all hover:scale-105 hover:shadow-violet-500/40 dark:bg-white dark:text-black">
                  <span>Mulai Sekarang</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <button className="flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-neutral-700 shadow-sm border border-neutral-200 transition-all hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800">
                <PlayCircle className="size-5 text-violet-500" />
                Demo App
              </button>
            </div>

            {/* TRUST SECTION */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 rounded-2xl border border-neutral-100 bg-white/50 p-4 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/50"
            >
              {/* Avatar Stack */}
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="size-10 rounded-full border-2 border-white bg-neutral-200 dark:border-neutral-800 overflow-hidden">
                    {/* Placeholder Avatar */}
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="h-full w-full object-cover" />
                  </div>
                ))}
                <div className="flex size-10 items-center justify-center rounded-full border-2 border-white bg-violet-100 text-xs font-bold text-violet-700 dark:border-neutral-800 dark:bg-violet-900 dark:text-white">+2k</div>
              </div>

              {/* Text Info */}
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-neutral-900 dark:text-white">4.9/5.0</span>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Dipercaya oleh <span className="font-semibold text-violet-600 dark:text-violet-400">2,500+ Mahasiswa</span>
                </p>
              </div>
            </motion.div>
          </div>

          {/* --- RIGHT COLUMN: IMAGES --- */}
          <div className="relative h-[450px] w-full lg:h-[600px] flex items-center justify-center pointer-events-none mt-12 lg:mt-0">
            {/* IMAGE 1: BACKGROUND (Struggle) */}
            <motion.div animate={floatingAnimation(0)} className="absolute top-0 right-4 lg:right-0 w-[240px] lg:w-[340px] aspect-[4/5] z-10">
              <div className="relative w-full h-full rounded-[2rem] bg-gradient-to-br from-white/40 to-white/10 dark:from-neutral-800/40 dark:to-neutral-900/10 backdrop-blur-sm border border-white/60 dark:border-neutral-700 shadow-xl p-3 rotate-6 transform transition-transform duration-700 hover:rotate-3">
                <div className="relative w-full h-full overflow-hidden rounded-[1.5rem] grayscale-[30%] opacity-90">
                  <Image src={hero_sec} alt="Mental Health Struggle" fill className="object-cover" />
                  <div className="absolute inset-0 bg-violet-900/10 mix-blend-overlay"></div>
                </div>
              </div>
            </motion.div>

            {/* IMAGE 2: FOREGROUND (Support) */}
            <motion.div animate={floatingAnimation(2)} className="absolute bottom-4 left-4 lg:left-8 w-[260px] lg:w-[380px] aspect-square z-20">
              <div className="relative w-full h-full rounded-[2.5rem] bg-white/30 dark:bg-neutral-800/30 backdrop-blur-xl border border-white/80 dark:border-neutral-600 shadow-2xl shadow-violet-500/20 p-4 -rotate-3 transform transition-transform duration-700 hover:rotate-0">
                {/* Badge Floating */}
                <div className="absolute -top-5 -right-5 z-30 flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-lg dark:bg-neutral-800 animate-bounce-slow">
                  <div className="rounded-full bg-green-100 p-1.5">
                    <Users className="size-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-400">Komunitas</p>
                    <p className="text-sm font-bold text-neutral-900 dark:text-white">Selalu Ada</p>
                  </div>
                </div>

                <div className="relative w-full h-full overflow-hidden rounded-[2rem] bg-white dark:bg-neutral-900">
                  <Image src={hero_main} alt="Mental Health Support" fill className="object-cover" priority />
                </div>
              </div>
            </motion.div>

            <div className="absolute left-1/2 top-1/2 -z-10 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/30 blur-[80px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
