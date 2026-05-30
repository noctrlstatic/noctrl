"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
};

const colors = {
  success: "bg-[#00ff80] text-black shadow-[0_0_30px_rgba(0,255,128,0.3)]",
  error: "bg-red-600 text-white shadow-[0_0_30px_rgba(239,68,68,0.3)]",
  warning: "bg-yellow-500 text-black shadow-[0_0_30px_rgba(234,179,8,0.3)]",
};

export default function Toast({ toast, onClose }) {
  if (!toast) return null;
  const Icon = icons[toast.type] || icons.success;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        exit={{ opacity: 0, y: -20, x: "-50%" }}
        className={`fixed top-8 left-1/2 z-50 font-bold px-6 py-4 rounded-2xl flex items-center gap-3 text-sm ${colors[toast.type] || colors.success}`}
      >
        <Icon size={18} />
        {toast.message}
        <button onClick={onClose} className="ml-4 opacity-60 hover:opacity-100 transition-opacity">
          <X size={16} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
