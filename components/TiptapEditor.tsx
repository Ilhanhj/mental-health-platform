/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import React, { useEffect } from "react"; // 1. Jangan lupa import useEffect
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Heading2, Quote, Undo, Redo } from "lucide-react";

// --- KOMPONEN TOOLBAR (TOMBOL-TOMBOL DI ATAS) ---
const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  // Helper class buat tombol biar kodenya gak panjang
  const buttonClass = (isActive: boolean) => `p-2 rounded hover:bg-violet-100 hover:text-violet-600 transition-colors ${isActive ? "bg-violet-100 text-violet-600" : "text-neutral-600 dark:text-neutral-400"}`;

  return (
    <div className="flex flex-wrap gap-2 border-b border-neutral-200 dark:border-neutral-700 p-3 bg-gray-50 dark:bg-neutral-900 rounded-t-xl">
      {/* BOLD */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        className={buttonClass(editor.isActive("bold"))}
        title="Bold"
      >
        <Bold size={18} />
      </button>

      {/* ITALIC */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        className={buttonClass(editor.isActive("italic"))}
        title="Italic"
      >
        <Italic size={18} />
      </button>

      {/* HEADING 2 (Kita pakai H2 sebagai sub-judul utama) */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
        className={buttonClass(editor.isActive("heading", { level: 2 }))}
        title="Heading"
      >
        <Heading2 size={18} />
      </button>

      {/* BULLET LIST */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBulletList().run();
        }}
        className={buttonClass(editor.isActive("bulletList"))}
        title="Bullet List"
      >
        <List size={18} />
      </button>

      {/* ORDERED LIST */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleOrderedList().run();
        }}
        className={buttonClass(editor.isActive("orderedList"))}
        title="Number List"
      >
        <ListOrdered size={18} />
      </button>

      {/* BLOCKQUOTE */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBlockquote().run();
        }}
        className={buttonClass(editor.isActive("blockquote"))}
        title="Quote"
      >
        <Quote size={18} />
      </button>

      <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600 mx-1 self-center" />

      {/* UNDO / REDO */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().undo().run();
        }}
        className={buttonClass(false)}
        title="Undo"
      >
        <Undo size={18} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().redo().run();
        }}
        className={buttonClass(false)}
        title="Redo"
      >
        <Redo size={18} />
      </button>
    </div>
  );
};

// --- KOMPONEN UTAMA EDITOR ---
interface TiptapProps {
  content: string;
  onChange: (html: string) => void;
}

// ... imports aman

const TiptapEditor = ({ content, onChange }: TiptapProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base dark:prose-invert focus:outline-none min-h-[300px] p-4 max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false, // <--- TAMBAHKAN BARIS INI (Fix Hydration Error)
  });

  useEffect(() => {
    // Kalau editor sudah siap DAN ada konten dari database...
    if (editor && content) {
      // Cek dulu: Apakah isi editor BEDA dengan data baru?
      // (Penting biar kursor gak loncat-loncat saat ngetik)
      if (editor.getHTML() !== content) {
        // Paksa isi editor dengan data baru
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]); // Jalankan setiap kali 'content' berubah

  return (
    <div className="w-full border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden bg-white dark:bg-neutral-950 focus-within:ring-2 focus-within:ring-violet-500 transition-all">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
