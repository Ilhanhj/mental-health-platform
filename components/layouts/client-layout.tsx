"use client"; // Wajib karena kita pakai hooks (usePathname)

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./navbar";
import Footer from "./footer";
import { ToastContainer } from "react-toastify";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Daftar halaman yang TIDAK boleh ada Navbar & Footer
  // Tambahkan path lain di sini jika perlu (misal: "/forgot-password")
  const hiddenPaths = ["/login", "/register", "/test-mental"];

  // Cek apakah halaman saat ini ada di dalam daftar hiddenPaths
  const isHidden = hiddenPaths.includes(pathname);

  return (
    <>
      {/* Jika BUKAN halaman hidden, tampilkan Navbar */}
      {!isHidden && <Navbar />}

      {children}
      <ToastContainer theme="dark" />

      {/* Jika BUKAN halaman hidden, tampilkan Footer */}
      {!isHidden && <Footer />}
    </>
  );
}
