"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight, HeartPulse, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulasi register delay
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      {/* --- BACKGROUND EFFECTS (Sama Persis dengan Login) --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-purple-500/30 blur-[100px] dark:bg-purple-900/30" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-pink-500/30 blur-[100px] dark:bg-pink-900/30" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* --- REGISTER CARD --- */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="overflow-hidden rounded-3xl border border-neutral-200/60 bg-white/70 p-8 shadow-2xl backdrop-blur-xl dark:border-neutral-800/60 dark:bg-neutral-900/70">
          {/* 1. Header */}
          <div className="mb-8 text-center">
            <Link href="/" className="mb-6 inline-flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg shadow-violet-500/20">
                <HeartPulse className="size-6 text-white" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Buat Akun Baru</h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Mulai langkah awal menuju ketenangan pikiran Anda.</p>
          </div>

          {/* 2. Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Nama Lengkap (Baru) */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Nama Lengkap</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                  <User className="size-5" />
                </div>
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  required
                  className="w-full rounded-xl border border-neutral-200 bg-white px-10 py-3 text-sm placeholder:text-neutral-400 focus:border-violet-500 focus:outline-hidden focus:ring-2 focus:ring-violet-500/20 dark:border-neutral-800 dark:bg-neutral-950 dark:focus:border-violet-500"
                />
              </div>
            </div>

            {/* Input Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Email</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                  <Mail className="size-5" />
                </div>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  required
                  className="w-full rounded-xl border border-neutral-200 bg-white px-10 py-3 text-sm placeholder:text-neutral-400 focus:border-violet-500 focus:outline-hidden focus:ring-2 focus:ring-violet-500/20 dark:border-neutral-800 dark:bg-neutral-950 dark:focus:border-violet-500"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                  <Lock className="size-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Buat password kuat"
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-10 py-3 text-sm placeholder:text-neutral-400 focus:border-violet-500 focus:outline-hidden focus:ring-2 focus:ring-violet-500/20 dark:border-neutral-800 dark:bg-neutral-950 dark:focus:border-violet-500"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
              <p className="text-xs text-neutral-500">Minimal 8 karakter</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-sm font-bold text-white transition-all hover:bg-neutral-800 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              {isLoading ? (
                <div className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black" />
              ) : (
                <>
                  Daftar Sekarang
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* 3. Footer Link */}
          <div className="mt-8 text-center text-sm text-neutral-600 dark:text-neutral-400">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-bold text-violet-600 hover:underline dark:text-violet-400">
              Masuk disini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
