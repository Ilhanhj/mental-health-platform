"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HeartPulse, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Artikel Edukasi", href: "/education" },
    { name: "Tentang Kami", href: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-100 bg-white/80 backdrop-blur-lg transition-all dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
        {/* --- BAGIAN 1: LOGO --- */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 cursor-pointer">
          <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-sm shadow-violet-200 dark:shadow-none">
            <HeartPulse className="size-5 text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-neutral-800 md:text-xl dark:text-white">MindCare UI</h1>
        </Link>

        {/* --- BAGIAN 2: NAVIGASI DESKTOP --- */}
        <ul className="hidden items-center gap-6 md:flex lg:gap-8">
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link href={link.href} className="text-sm font-medium text-neutral-600 transition-colors hover:text-violet-600 dark:text-neutral-300 dark:hover:text-violet-400">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* --- BAGIAN 3: TOMBOL AKSI DESKTOP (Updated) --- */}
        <div className="hidden items-center gap-4 md:flex">
          {/* CTA UTAMA: Tes Kesehatan Mental */}
          <Link
            href="/test-mental"
            className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:bg-neutral-800 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/20 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            {/* Efek Kilau Gradient saat Hover */}
            <span className="absolute inset-0 bg-gradient-to-r from-violet-600/0 via-pink-500/0 to-violet-600/0 transition-all duration-500 group-hover:from-violet-600/10 group-hover:via-pink-500/20 group-hover:to-violet-600/10 opacity-0 group-hover:opacity-100"></span>

            <HeartPulse className="relative size-4 animate-pulse text-pink-400 transition-colors group-hover:text-pink-300 dark:text-violet-500 dark:group-hover:text-violet-600" />
            <span className="relative z-10">Tes Kesehatan Mental</span>
          </Link>

          {/* Login / Register */}
          <div className="flex items-center text-sm font-semibold text-neutral-700 dark:text-neutral-200">
            <Link href="/login" className="hover:text-violet-600 transition-colors px-3 py-2">
              Login
            </Link>
            <span className="text-neutral-300 dark:text-neutral-700">|</span>
            <Link href="/register" className="hover:text-violet-600 transition-colors px-3 py-2">
              Register
            </Link>
          </div>
        </div>

        {/* --- BAGIAN 4: TOMBOL HAMBURGER MOBILE --- */}
        <div className="flex items-center md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100 focus:outline-hidden dark:text-neutral-300 dark:hover:bg-neutral-800">
            {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* --- BAGIAN 5: MENU MOBILE --- */}
      {isOpen && (
        <div className="border-t border-neutral-100 bg-white px-4 py-4 md:hidden dark:border-neutral-800 dark:bg-neutral-950">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link href={link.href} onClick={() => setIsOpen(false)} className="block text-base font-medium text-neutral-700 hover:text-violet-600 dark:text-neutral-200 dark:hover:text-violet-400">
                  {link.name}
                </Link>
              </li>
            ))}
            <hr className="border-neutral-100 dark:border-neutral-800" />

            {/* Tombol Aksi Mobile (Updated) */}
            <div className="flex flex-col gap-3 pt-2">
              <Link
                href="/test-mental"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/30 transition-transform active:scale-95 hover:shadow-violet-500/50"
              >
                <HeartPulse className="size-5 animate-pulse" />
                Tes Kesehatan Mental
              </Link>

              <div className="flex w-full gap-3 mt-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center rounded-xl border border-neutral-200 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 active:scale-95 dark:border-neutral-800 dark:text-white dark:hover:bg-neutral-900"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center rounded-xl bg-neutral-900 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                >
                  Register
                </Link>
              </div>
            </div>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
