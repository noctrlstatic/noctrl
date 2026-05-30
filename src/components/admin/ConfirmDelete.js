"use client";

import { motion } from "framer-motion";
import { Trash2, Loader2 } from "lucide-react";

export default function ConfirmDelete({ product, submitting, onConfirm, onCancel }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      ></motion.div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md bg-[#0a0a0a] border border-red-500/10 rounded-[2rem] shadow-2xl p-8 relative z-10 text-center"
      >
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto mb-6">
          <Trash2 size={22} />
        </div>

        <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-2">Eliminare Prodotto?</h3>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          Sei sicuro di voler rimuovere permanentemente <span className="text-white font-bold font-mono">&ldquo;{product.name}&rdquo;</span>? Questa azione è irreversibile.
        </p>

        <div className="flex gap-4">
          <button
            onClick={onCancel}
            disabled={submitting}
            className="flex-1 py-3.5 border border-white/10 hover:border-white/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
          >
            Annulla
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)]"
          >
            {submitting ? (
              <Loader2 size={14} className="animate-spin mx-auto" />
            ) : (
              "Conferma ed Elimina"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
