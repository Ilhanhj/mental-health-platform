"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { LayoutDashboard, PlusCircle, FileText, Mail, LogOut, User, Activity } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation"; // Untuk deteksi halaman aktif

// --- DEFINISI TIPE NAVIGASI ---
type NavItem = { type: "link"; label: string; href: string; icon: React.JSX.Element } | { type: "separator"; label?: string };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname(); // Dapatkan URL saat ini

  // --- STRUKTUR MENU ---
  const navItems: NavItem[] = [
    {
      type: "link",
      label: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5 shrink-0" />,
    },
    { type: "separator", label: "KONTEN" },
    {
      type: "link",
      label: "Tambah Artikel",
      href: "/admin/addArticle",
      icon: <PlusCircle className="h-5 w-5 shrink-0" />,
    },
    {
      type: "link",
      label: "Daftar Artikel",
      href: "/admin/articlesList",
      icon: <FileText className="h-5 w-5 shrink-0" />,
    },
    { type: "separator", label: "PENGGUNA" },
    {
      type: "link",
      label: "Email Berlangganan",
      href: "/admin/emailsList",
      icon: <Mail className="h-5 w-5 shrink-0" />,
    },
    {
      type: "link",
      label: "Hasil Tes DASS",
      href: "/admin/dassResults",
      icon: <Activity className="h-5 w-5 shrink-0" />,
    },
  ];

  const logoutLink = {
    label: "Logout",
    href: "/",
    icon: <LogOut className="h-5 w-5 shrink-0 text-neutral-400 group-hover/sidebar:text-red-500 transition-colors" />,
  };

  return (
    <div className={cn("flex flex-col md:flex-row w-full flex-1 mx-auto overflow-hidden h-screen bg-[#050505] relative")}>
      {/* --- GLOBAL AURORA BACKGROUND (SHARED FOR ALL ADMIN PAGES) --- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] animate-pulse mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[100px] animate-pulse delay-1000 mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse delay-2000 mix-blend-screen" />
        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* --- SIDEBAR GLASSMORPHISM --- */}
      <div className="relative z-20 h-full flex-shrink-0">
        <Sidebar open={open} setOpen={setOpen}>
          {/* Sidebar Body: Transparan + Blur */}
          <SidebarBody className="justify-between gap-10 bg-[#0A0A0A]/60 backdrop-blur-xl border-r border-white/5 shadow-2xl">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
              {/* LOGO */}
              {open ? <Logo /> : <LogoIcon />}

              {/* MENU LINKS */}
              <div className="mt-8 flex flex-col gap-1">
                {navItems.map((item, idx) => {
                  // RENDER SEPARATOR
                  if (item.type === "separator") {
                    return (
                      <div key={idx} className="my-2 px-2">
                        <div className={cn("transition-all duration-300 overflow-hidden", open ? "h-auto opacity-100" : "h-0 opacity-0")}>
                          {item.label && <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2 ml-1">{item.label}</p>}
                        </div>
                        <div className="h-px bg-white/5 w-full"></div>
                      </div>
                    );
                  }

                  // CHECK ACTIVE STATE
                  const isActive = pathname === item.href;

                  // CUSTOM LINK RENDERER (Agar bisa styling active state)
                  return (
                    <div
                      key={idx}
                      className={cn("rounded-lg transition-all duration-200 group/sidebar", isActive ? "bg-violet-600/10 border border-violet-600/20 shadow-[0_0_15px_rgba(124,58,237,0.15)]" : "hover:bg-white/5 border border-transparent")}
                    >
                      <SidebarLink
                        link={
                          {
                            ...item,
                            icon: React.cloneElement(item.icon, {
                              className: cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-violet-400" : "text-neutral-400 group-hover/sidebar:text-white"),
                            }),
                          } as any
                        } // 👈 INI OBAT KUATNYA MAS (Bypass Error TypeScript)
                        className={cn(isActive && "font-bold text-white")}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex flex-col gap-2">
              <div className="h-px bg-white/5 w-full mb-2"></div>

              {/* Profil Admin Kecil */}
              <SidebarLink
                link={
                  {
                    label: "Admin MindCare",
                    href: "#",
                    icon: (
                      <div className="h-7 w-7 shrink-0 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shadow-inner shadow-violet-500/10">
                        <User className="h-4 w-4 text-violet-400" />
                      </div>
                    ),
                  } as any
                } // 👈 SAYA TAMBAHKAN DISINI JUGA BIAR AMAN
              />

              <div className="mt-1">
                <SidebarLink link={logoutLink} className="hover:bg-red-900/10 rounded-lg transition-colors border border-transparent hover:border-red-900/20" />
              </div>
            </div>
          </SidebarBody>
        </Sidebar>
      </div>

      {/* Konten Utama (Transparent karena BG ada di parent wrapper) */}
      <main className="flex-1 overflow-y-auto bg-transparent relative scroll-smooth z-10">{children}</main>
    </div>
  );
}

// --- LOGO COMPONENT ---
export const Logo = () => {
  return (
    <Link href="/admin" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <div className="h-7 w-7 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(124,58,237,0.5)] border border-white/10">
        <span className="text-white font-bold text-xs">M</span>
      </div>
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-bold text-white whitespace-pre text-lg tracking-tight">
        MindCare
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link href="/admin" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <div className="h-7 w-7 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(124,58,237,0.5)] border border-white/10">
        <span className="text-white font-bold text-xs">M</span>
      </div>
    </Link>
  );
};
