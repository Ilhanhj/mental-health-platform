import { cn } from "@/lib/utils";
import { ShieldCheck, BrainCircuit, Smile, Clock, Layout, BookOpen, Sparkles, Leaf } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "Privasi Terjamin",
      description: "Data dan hasil tes Anda dienkripsi. Kami menghargai anonimitas Anda sepenuhnya.",
      icon: <ShieldCheck className="text-violet-500" />,
    },
    {
      title: "Berbasis Sains",
      description: "Metode deteksi dan materi edukasi disusun berdasarkan jurnal psikologi terpercaya.",
      icon: <BrainCircuit className="text-pink-500" />,
    },
    {
      title: "Mudah Digunakan",
      description: "Antarmuka yang tenang dan tidak membingungkan, didesain untuk kenyamanan mental.",
      icon: <Layout className="text-violet-500" />,
    },
    {
      title: "Akses 24/7",
      description: "Dukungan kesehatan mental digital yang siap kapan saja Anda butuhkan.",
      icon: <Clock className="text-pink-500" />,
    },
    {
      title: "Edukasi Holistik",
      description: "Materi lengkap mulai dari manajemen stres hingga teknik mindfulness.",
      icon: <BookOpen className="text-violet-500" />,
    },
    {
      title: "Tanpa Tekanan",
      description: "Tidak ada target skor atau kompetisi. Ini adalah perjalanan personal Anda.",
      icon: <Leaf className="text-green-500" />, // Sedikit aksen hijau alam
    },
    {
      title: "AI Pendamping",
      description: "Algoritma cerdas yang memberikan rekomendasi konten sesuai kondisi mood Anda.",
      icon: <Sparkles className="text-yellow-500" />, // Aksen hangat
    },
    {
      title: "Meningkatkan Mood",
      description: "Desain visual dan interaksi yang dirancang untuk meredakan kecemasan.",
      icon: <Smile className="text-pink-500" />,
    },
  ];

  return (
    <section className="relative z-20 py-10 lg:py-20">
      {/* Header Section */}
      <div className="mb-12 px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100 md:text-4xl">Mengapa Memilih MindCare?</h2>
        <p className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">Kami menggabungkan teknologi modern dengan pendekatan psikologi yang memanusiakan pengguna.</p>
      </div>

      {/* Grid Features */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <Feature key={feature.title} {...feature} index={index} />
        ))}
      </div>
    </section>
  );
}

const Feature = ({ title, description, icon, index }: { title: string; description: string; icon: React.ReactNode; index: number }) => {
  return (
    <div
      className={cn(
        // Base Layout & Borders
        "group/feature relative flex flex-col py-8 lg:py-10",
        "border-neutral-200/60 dark:border-neutral-800/60", // Border lebih halus
        "transition-colors duration-300 hover:bg-white/40 dark:hover:bg-neutral-900/40", // Efek glass saat hover
        "lg:border-r",
        (index === 0 || index === 4) && "lg:border-l",
        index < 4 && "lg:border-b"
      )}
    >
      {/* Hover Gradient Effect (Background halus saat hover) */}
      <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-violet-50/50 to-transparent opacity-0 transition duration-300 group-hover/feature:opacity-100 dark:from-violet-900/10" />

      {/* Icon Area */}
      <div className="relative z-10 mb-4 px-8 text-neutral-600 dark:text-neutral-400">
        <div className="flex size-10 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900">{icon}</div>
      </div>

      {/* Title Area */}
      <div className="relative z-10 mb-2 px-8 text-lg font-bold">
        <div className="absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-br-full rounded-tr-full bg-neutral-200 transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-violet-500 dark:bg-neutral-700" />
        <span className="inline-block text-neutral-800 transition duration-200 group-hover/feature:translate-x-2 dark:text-neutral-100">{title}</span>
      </div>

      {/* Description Area */}
      <p className="relative z-10 max-w-xs px-8 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{description}</p>
    </div>
  );
};
