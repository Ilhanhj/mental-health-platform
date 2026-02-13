"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react"; // Pastikan lucide-react terinstall

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  isLoading?: boolean;
}

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title = "Konfirmasi Hapus", message = "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.", isLoading = false }: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* 1. Backdrop Gelap (Overlay) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose} // Klik luar buat tutup
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* 2. Kotak Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700"
          >
            {/* Tombol Close X di pojok */}
            <button onClick={onClose} className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-500 dark:hover:text-neutral-300" disabled={isLoading}>
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              {/* Icon Peringatan */}
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 dark:bg-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500" />
              </div>

              <div className="mt-4 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-neutral-900 dark:text-white">{title}</h3>
                <div className="mt-2">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{message}</p>
                </div>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="inline-flex w-full justify-center rounded-lg border border-neutral-300 bg-white px-4 py-2 text-base font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none sm:w-auto sm:text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className="inline-flex w-full justify-center rounded-lg bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  "Hapus Sekarang"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
