"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, HeartPulse } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulasi login delay
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      {/* --- BACKGROUND EFFECTS (Konsisten dengan Home) --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-purple-500/30 blur-[100px] dark:bg-purple-900/30" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-pink-500/30 blur-[100px] dark:bg-pink-900/30" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* --- LOGIN CARD --- */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="overflow-hidden rounded-3xl border border-neutral-200/60 bg-white/70 p-8 shadow-2xl backdrop-blur-xl dark:border-neutral-800/60 dark:bg-neutral-900/70">
          {/* 1. Header: Logo & Greeting */}
          <div className="mb-8 text-center">
            <Link href="/" className="mb-6 inline-flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg shadow-violet-500/20">
                <HeartPulse className="size-6 text-white" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Selamat Datang Kembali</h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Lanjutkan perjalanan kesehatan mental Anda hari ini.</p>
          </div>

          {/* 2. Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Password</label>
                <Link href="/forgot-password" className="text-xs font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400">
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                  <Lock className="size-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-neutral-200 bg-white px-10 py-3 text-sm placeholder:text-neutral-400 focus:border-violet-500 focus:outline-hidden focus:ring-2 focus:ring-violet-500/20 dark:border-neutral-800 dark:bg-neutral-950 dark:focus:border-violet-500"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-sm font-bold text-white transition-all hover:bg-neutral-800 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              {isLoading ? (
                <div className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black" />
              ) : (
                <>
                  Masuk Sekarang
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* 3. Divider & Social Login */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
            <span className="text-xs text-neutral-500 dark:text-neutral-400">atau lanjutkan dengan</span>
            <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
          </div>

          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white py-2.5 text-sm font-semibold text-neutral-700 transition-all hover:bg-neutral-50 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-900">
            <svg className="size-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>

          {/* 4. Footer Link */}
          <div className="mt-8 text-center text-sm text-neutral-600 dark:text-neutral-400">
            Belum punya akun?{" "}
            <Link href="/register" className="font-bold text-violet-600 hover:underline dark:text-violet-400">
              Daftar gratis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
