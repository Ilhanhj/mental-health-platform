export type Severity = "Normal" | "Ringan" | "Sedang" | "Parah" | "Sangat Parah";

export interface Question {
  id: number;
  text: string;
  category: "depression" | "anxiety" | "stress";
}

// Pertanyaan DASS-21 (Terjemahan Bahasa Indonesia)
export const questions: Question[] = [
  { id: 1, text: "Saya merasa sulit untuk menenangkan diri", category: "stress" },
  { id: 2, text: "Saya menyadari mulut saya terasa kering", category: "anxiety" },
  { id: 3, text: "Saya tidak dapat melihat hal positif dari suatu kejadian", category: "depression" },
  { id: 4, text: "Saya mengalami kesulitan bernapas (misal: terengah-engah tanpa aktivitas fisik)", category: "anxiety" },
  { id: 5, text: "Saya merasa sepertinya tidak kuat lagi untuk melakukan kegiatan", category: "depression" },
  { id: 6, text: "Saya cenderung bereaksi berlebihan terhadap situasi", category: "stress" },
  { id: 7, text: "Saya merasa gemetar (misal: pada tangan)", category: "anxiety" },
  { id: 8, text: "Saya merasa terlalu gelisah", category: "stress" },
  { id: 9, text: "Saya khawatir dengan situasi di mana saya mungkin menjadi panik dan mempermalukan diri sendiri", category: "anxiety" },
  { id: 10, text: "Saya merasa tidak ada hal yang dapat diharapkan di masa depan", category: "depression" },
  { id: 11, text: "Saya merasa gelisah", category: "stress" },
  { id: 12, text: "Saya merasa sulit untuk rileks", category: "stress" },
  { id: 13, text: "Saya merasa sedih dan tertekan", category: "depression" },
  { id: 14, text: "Saya tidak dapat memaklumi hal apa pun yang menghalangi saya menyelesaikan hal yang sedang saya lakukan", category: "stress" },
  { id: 15, text: "Saya merasa sepertinya saya hampir panik", category: "anxiety" },
  { id: 16, text: "Saya merasa tidak antusias dalam hal apa pun", category: "depression" },
  { id: 17, text: "Saya merasa bahwa saya tidak berharga sebagai seorang manusia", category: "depression" },
  { id: 18, text: "Saya merasa bahwa saya mudah tersinggung", category: "stress" },
  { id: 19, text: "Saya menyadari detak jantung saya cepat walaupun tidak melakukan aktivitas fisik", category: "anxiety" },
  { id: 20, text: "Saya merasa takut tanpa alasan yang jelas", category: "anxiety" },
  { id: 21, text: "Saya merasa hidup tidak berarti", category: "depression" },
];

// Skala Likert
export const options = [
  { value: 0, label: "Tidak sesuai dengan saya sama sekali" },
  { value: 1, label: "Sesuai dengan saya sampai tingkat tertentu" },
  { value: 2, label: "Sesuai dengan saya pada tingkat yang dapat dipertimbangkan" },
  { value: 3, label: "Sangat sesuai dengan saya" },
];

// Logika Kategori (Score * 2 untuk DASS-21 agar setara DASS-42)
export const getSeverity = (score: number, type: "depression" | "anxiety" | "stress"): Severity => {
  const finalScore = score * 2; // Penting: DASS-21 dikali 2

  if (type === "depression") {
    if (finalScore <= 9) return "Normal";
    if (finalScore <= 13) return "Ringan";
    if (finalScore <= 20) return "Sedang";
    if (finalScore <= 27) return "Parah";
    return "Sangat Parah";
  }

  if (type === "anxiety") {
    if (finalScore <= 7) return "Normal";
    if (finalScore <= 9) return "Ringan";
    if (finalScore <= 14) return "Sedang";
    if (finalScore <= 19) return "Parah";
    return "Sangat Parah";
  }

  // Stress
  if (finalScore <= 14) return "Normal";
  if (finalScore <= 18) return "Ringan";
  if (finalScore <= 25) return "Sedang";
  if (finalScore <= 33) return "Parah";
  return "Sangat Parah";
};
