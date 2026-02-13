import DASSQuestionnaire from "@/components/sections/education/dass-questionnaire";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tes Kesehatan Mental (DASS-21) - MindCare",
  description: "Cek tingkat stres, kecemasan, dan depresi Anda secara mandiri.",
};

export default function TesMentalPage() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-50 dark:bg-[#050505] flex items-center justify-center p-4">
      {/* --- BACKGROUND VIBRANT AURORA --- */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {/* 1. Bola Ungu Utama (Kiri Atas) - Bergerak Lambat */}
        <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] md:w-[600px] md:h-[600px] bg-violet-600/30 dark:bg-violet-600/20 rounded-full blur-[120px] animate-pulse mix-blend-multiply dark:mix-blend-screen" />

        {/* 2. Bola Pink Vibrant (Kanan Tengah) - Delay */}
        <div className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] md:w-[500px] md:h-[500px] bg-fuchsia-500/30 dark:bg-fuchsia-600/20 rounded-full blur-[120px] animate-pulse delay-1000 mix-blend-multiply dark:mix-blend-screen" />

        {/* 3. Bola Biru Dalam (Bawah Kiri) - Delay Lebih Lama */}
        <div className="absolute bottom-[-10%] left-[10%] w-[60vw] h-[60vw] md:w-[600px] md:h-[600px] bg-indigo-500/30 dark:bg-indigo-600/20 rounded-full blur-[140px] animate-pulse delay-2000 mix-blend-multiply dark:mix-blend-screen" />

        {/* 4. Overlay Noise Halus (Opsional, biar makin estetik kayak kaca) */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
      </div>

      {/* Container Utama */}
      <div className="container mx-auto max-w-4xl relative z-10 flex items-center justify-center h-full">
        <DASSQuestionnaire />
      </div>
    </div>
  );
}
