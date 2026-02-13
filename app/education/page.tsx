import React from "react";
import type { Metadata } from "next";
import EducationList from "@/components/sections/education/articles-list";

export const metadata: Metadata = {
  title: "Artikel & Edukasi - MindCare UI",
  description: "Pusat wawasan kesehatan mental untuk mahasiswa.",
};

export default function EdukasiPage() {
  return (
    <main>
      <EducationList />
    </main>
  );
}
