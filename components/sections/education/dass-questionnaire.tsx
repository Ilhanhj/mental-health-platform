/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ArrowRight, RefreshCcw, ShieldCheck, User, Sparkles, Calendar, HeartPulse, BookOpen, Activity } from "lucide-react";
import { questions, options, getSeverity, Severity } from "@/app/data/dass-data";
import axios from "axios";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export default function DASSQuestionnaire() {
  const [step, setStep] = useState<"intro" | "preparing" | "question" | "result">("intro");
  const [userInfo, setUserInfo] = useState({ name: "", age: "" });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const [isProcessing, setIsProcessing] = useState(false);
  const [recommendedArticles, setRecommendedArticles] = useState<any[]>([]);
  const [recLoading, setRecLoading] = useState(false);

  // --- LOGIC START ---
  const handleStart = () => {
    setStep("preparing");
    setTimeout(() => {
      setStep("question");
    }, 5000);
  };

  // --- LOGIC FETCH ARTIKEL (FALLBACK SYSTEM) ---
  const fetchRecommendations = async (targetCategory: string) => {
    setRecLoading(true);
    try {
      const res = await axios.get("/api/article");
      if (res.data.success) {
        const allArticles = res.data.articles;

        // 1. PRIORITAS UTAMA
        let filtered = allArticles.filter((art: any) => art.category.toLowerCase() === targetCategory.toLowerCase());

        // 2. FALLBACK 1
        if (filtered.length === 0) {
          filtered = allArticles.filter((art: any) => {
            const c = art.category.toLowerCase();
            return c === "tips & trick" || c === "mental health" || c === "self improvement";
          });
        }

        // 3. FALLBACK 2 (ULTIMATE)
        if (filtered.length === 0) {
          filtered = allArticles;
        }

        setRecommendedArticles(filtered.slice(0, 3));
      }
    } catch (error) {
      console.error("Gagal load rekomendasi", error);
    } finally {
      setRecLoading(false);
    }
  };

  const calculateScores = () => {
    let dep = 0,
      anx = 0,
      str = 0;
    questions.forEach((q) => {
      const val = answers[q.id] || 0;
      if (q.category === "depression") dep += val;
      if (q.category === "anxiety") anx += val;
      if (q.category === "stress") str += val;
    });
    return { dep, anx, str };
  };

  const handleAnswer = async (value: number) => {
    if (isProcessing || !questions[currentQuestionIndex]) return;
    setIsProcessing(true);

    const currentQ = questions[currentQuestionIndex];
    const newAnswer = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswer);

    if (currentQuestionIndex + 1 < questions.length) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        setIsProcessing(false);
      }, 200);
    } else {
      // --- FINAL LOGIC ---
      let dep = 0,
        anx = 0,
        str = 0;
      questions.forEach((q) => {
        const val = newAnswer[q.id] || 0;
        if (q.category === "depression") dep += val;
        if (q.category === "anxiety") anx += val;
        if (q.category === "stress") str += val;
      });

      // LOGIKA REKOMENDASI ARTIKEL
      let targetCategory = "Self Improvement";
      const isDepressionConcern = getSeverity(dep, "depression") !== "Normal";
      const isAnxietyConcern = getSeverity(anx, "anxiety") !== "Normal";
      const isStressConcern = getSeverity(str, "stress") !== "Normal";

      if (isDepressionConcern || isAnxietyConcern || isStressConcern) {
        const scores = [
          { type: "Depression", val: dep * 2 },
          { type: "Anxiety", val: anx * 2 },
          { type: "Stress", val: str * 2 },
        ];
        scores.sort((a, b) => b.val - a.val);
        targetCategory = scores[0].type;
      }

      fetchRecommendations(targetCategory);

      const payload = {
        name: userInfo.name,
        age: userInfo.age,
        depressionScore: dep * 2,
        anxietyScore: anx * 2,
        stressScore: str * 2,
        depressionLevel: getSeverity(dep, "depression"),
        anxietyLevel: getSeverity(anx, "anxiety"),
        stressLevel: getSeverity(str, "stress"),
      };

      try {
        await axios.post("/api/dass", payload);
        toast.success("Hasil tes berhasil disimpan!");
      } catch (error: any) {
        console.error("Gagal menyimpan hasil DASS:", error);
      }

      setStep("result");
      setIsProcessing(false);
    }
  };

  const restart = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setRecommendedArticles([]);
    setStep("intro");
    setIsProcessing(false);
  };

  // --- RENDERERS ---

  // 1. INTRO
  const renderIntro = () => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full">
      <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/20 dark:border-neutral-800 rounded-3xl p-8 text-center shadow-xl">
        <div className="mx-auto bg-violet-100 dark:bg-violet-900/30 w-16 h-16 rounded-2xl flex items-center justify-center text-violet-600 mb-6 rotate-3 shadow-md border border-violet-200/50 dark:border-violet-800/50">
          <ShieldCheck size={32} />
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-3 tracking-tight">Cek Kesehatan Mentalmu</h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">Luangkan waktu 5 menit untuk memahami perasaanmu. Tidak ada jawaban benar atau salah, jawablah dengan jujur sesuai kondisi seminggu terakhir.</p>
        </div>
        <div className="space-y-4 text-left">
          <div>
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1 mb-2 block">Nama Panggilan</label>
            <div className="relative">
              <input
                type="text"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                placeholder="Nama kamu..."
                className="w-full bg-gray-50 dark:bg-neutral-800 border-2 border-transparent focus:border-violet-500 rounded-xl pl-4 pr-10 py-3 outline-none font-medium dark:text-white transition-all placeholder:text-neutral-400"
              />
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 size-5" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1 mb-2 block">Umur (Opsional)</label>
            <div className="relative">
              <input
                type="number"
                value={userInfo.age}
                onChange={(e) => setUserInfo({ ...userInfo, age: e.target.value })}
                placeholder="Contoh: 21"
                className="w-full bg-gray-50 dark:bg-neutral-800 border-2 border-transparent focus:border-violet-500 rounded-xl pl-4 pr-10 py-3 outline-none font-medium dark:text-white transition-all placeholder:text-neutral-400"
              />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 size-5" />
            </div>
          </div>
        </div>
        <button
          onClick={handleStart}
          disabled={!userInfo.name}
          className="mt-8 w-full bg-neutral-900 dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-violet-500/20"
        >
          Mulai Tes <ArrowRight size={20} />
        </button>
      </div>
    </motion.div>
  );

  // 1.5. PREPARING
  const PreparingView = ({ name }: { name: string }) => {
    const [text, setText] = useState("Tarik napas...");
    useEffect(() => {
      const timer = setTimeout(() => {
        setText("Hembuskan perlahan...");
      }, 2500);
      return () => clearTimeout(timer);
    }, []);
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center space-y-8">
        <div className="relative flex items-center justify-center w-40 h-40">
          <motion.div animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 5, ease: "easeInOut" }} className="absolute inset-0 bg-violet-300/50 dark:bg-violet-900/40 rounded-full blur-2xl" />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 5, ease: "easeInOut" }}
            className="relative bg-white dark:bg-neutral-800 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl border-4 border-violet-100 dark:border-violet-900/50"
          >
            <HeartPulse size={40} className="text-violet-500 fill-violet-500/20" />
          </motion.div>
        </div>
        <div className="space-y-2">
          <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-neutral-800 dark:text-white">
            Halo, {name}!
          </motion.h2>
          <motion.p key={text} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-xl text-violet-600 dark:text-violet-400 font-medium">
            {text}
          </motion.p>
        </div>
      </motion.div>
    );
  };

  // 2. QUESTION
  const renderQuestion = () => {
    const question = questions[currentQuestionIndex];
    if (!question) return null;
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <motion.div key="question-box" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl w-full">
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-xl border border-neutral-100 dark:border-neutral-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1.5 bg-gray-100 w-full">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-violet-500" />
          </div>
          <div className="text-center mb-4 mt-2">
            <span className="text-xs font-bold text-violet-500 tracking-widest uppercase">
              Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="min-h-[80px] flex items-center justify-center text-center mb-8"
            >
              <h2 className="text-2xl font-bold text-neutral-800 dark:text-white leading-snug">"{question.text}"</h2>
            </motion.div>
          </AnimatePresence>
          <div className="grid grid-cols-1 gap-3">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                disabled={isProcessing}
                className={cn(
                  "group w-full py-4 px-6 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between disabled:opacity-70 disabled:cursor-not-allowed",
                  answers[question.id] === opt.value ? "border-violet-500 bg-violet-50 dark:bg-violet-900/10 text-violet-700" : "border-neutral-100 dark:border-neutral-800 hover:border-violet-300 hover:bg-violet-50/50"
                )}
              >
                <span className="font-medium text-neutral-600 dark:text-neutral-300 group-hover:text-violet-700 dark:group-hover:text-white">{opt.label}</span>
                <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors", answers[question.id] === opt.value ? "border-violet-500 bg-violet-500" : "border-neutral-300")}>
                  {answers[question.id] === opt.value && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  // 3. RESULT (BENTO UI STYLE) 🍱
  const renderResult = () => {
    const { dep, anx, str } = calculateScores();

    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-5xl w-full h-[90vh] md:h-auto overflow-y-auto custom-scrollbar md:overflow-visible p-2">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {/* --- HEADER --- */}
          <div className="md:col-span-12 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/20 dark:border-neutral-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600">
                <Sparkles size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Hasil Analisis {userInfo.name}</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Berikut adalah gambaran kondisi emosionalmu.</p>
              </div>
            </div>
            <div className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full text-neutral-500">{new Date().toLocaleDateString("id-ID", { dateStyle: "full" })}</div>
          </div>

          {/* --- SCORE CARDS (ROW 1) --- */}
          <div className="md:col-span-4">
            <ResultCard title="Depresi" score={dep * 2} severity={getSeverity(dep, "depression")} delay={0.1} icon="cloud" />
          </div>
          <div className="md:col-span-4">
            <ResultCard title="Kecemasan" score={anx * 2} severity={getSeverity(anx, "anxiety")} delay={0.2} icon="zap" />
          </div>
          <div className="md:col-span-4">
            <ResultCard title="Stres" score={str * 2} severity={getSeverity(str, "stress")} delay={0.3} icon="activity" />
          </div>

          {/* --- RECOMMENDATIONS (ROW 2 - LEFT - SPAN 8) --- */}
          <div className="md:col-span-8 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/20 dark:border-neutral-800 rounded-3xl p-6 shadow-lg flex flex-col">
            <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen className="text-violet-500" size={20} />
              Rekomendasi untuk Pulih & Tumbuh
            </h3>

            <div className="flex-1">
              {recLoading ? (
                <div className="h-full flex items-center justify-center text-neutral-400 animate-pulse">Menyiapkan bacaan...</div>
              ) : recommendedArticles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
                  {recommendedArticles.map((article) => (
                    <Link href={`/education/${article._id}`} key={article._id} target="_blank" className="h-full">
                      <div className="group h-full bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800/50 rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-violet-900/10 hover:border-violet-200 dark:hover:border-violet-900/50 transition-all duration-300 flex flex-col relative">
                        {/* Image Container with Zoom Effect */}
                        <div className="relative h-36 w-full bg-gray-200 shrink-0 overflow-hidden">
                          <Image src={article.image || "/images/placeholder.jpg"} alt={article.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                          {/* Glass Overlay Gradient (Biar teks kebaca kalau ada overlay) */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {/* Category Badge (Glassmorphism Pill) */}
                          <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/60 backdrop-blur-md text-violet-700 dark:text-violet-300 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-white/20 tracking-wide uppercase">
                            {article.category}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col flex-1">
                          <h4 className="font-bold text-neutral-800 dark:text-white text-sm leading-snug line-clamp-2 mb-3 group-hover:text-violet-600 transition-colors">{article.title}</h4>

                          <div className="mt-auto flex items-center justify-between">
                            <span className="text-[10px] font-bold text-neutral-400 group-hover:text-violet-500 transition-colors uppercase tracking-wider">Baca Artikel</span>
                            <div className="w-6 h-6 rounded-full bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:bg-violet-500 group-hover:text-white transition-all duration-300">
                              <ArrowRight size={12} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-2xl text-neutral-400 text-sm">Belum ada artikel spesifik.</div>
              )}
            </div>
          </div>

          {/* --- INFO & ACTION (ROW 2 - RIGHT - SPAN 4) --- */}
          <div className="md:col-span-4 flex flex-col gap-4">
            {/* Info Box */}
            <div className="flex-1 bg-violet-500 text-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3 font-bold opacity-90">
                  <Activity size={18} /> Apa Artinya?
                </div>
                <p className="text-sm leading-relaxed opacity-90">
                  Skor ini adalah potret emosimu seminggu terakhir. <br />
                  <br />
                  Hasil <strong>Parah</strong> bukan akhir segalanya, tapi sinyal tubuhmu butuh istirahat atau bantuan profesional.
                </p>
              </div>
            </div>

            {/* Restart Button */}
            <button
              onClick={restart}
              className="bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-white border border-white/20 p-5 rounded-3xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
              Ulangi Tes
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      {step === "intro" && renderIntro()}
      {step === "preparing" && <PreparingView name={userInfo.name} />}
      {step === "question" && renderQuestion()}
      {step === "result" && renderResult()}
    </div>
  );
}

// --- SUB COMPONENTS ---

// Updated Result Card for Bento
function ResultCard({ title, score, severity, delay, icon }: { title: string; score: number; severity: Severity; delay: number; icon?: string }) {
  let color = "text-green-600 bg-green-50 border-green-200";
  if (severity === "Ringan") color = "text-yellow-600 bg-yellow-50 border-yellow-200";
  if (severity === "Sedang") color = "text-orange-600 bg-orange-50 border-orange-200";
  if (severity === "Parah" || severity === "Sangat Parah") color = "text-red-600 bg-red-50 border-red-200";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay }}
      className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl p-5 rounded-3xl border border-white/20 dark:border-neutral-800 shadow-lg h-full flex flex-col items-center justify-center text-center relative overflow-hidden"
    >
      <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 relative z-10">{title}</p>
      <h3 className="text-5xl font-extrabold text-neutral-800 dark:text-white mb-3 relative z-10">{score}</h3>
      <div className={cn("inline-block px-4 py-1.5 rounded-full text-xs font-bold border relative z-10", color)}>{severity}</div>
    </motion.div>
  );
}
