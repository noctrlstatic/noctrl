"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";

export default function NewsletterPopup({
  showPopup,
  onClose,
  email,
  onEmailChange,
  onSubmit,
  submitting,
  submitSuccess,
  submitError,
}) {
  return (
    <AnimatePresence>
      {showPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-xl cursor-pointer"
          />
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            className="w-full max-w-lg bg-[#111] border border-white/[0.06] rounded-3xl p-10 sm:p-14 text-center relative z-10"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <X size={16} />
            </button>

            <div className="w-16 h-16 rounded-full bg-[#d4c5a9]/10 border border-[#d4c5a9]/20 flex items-center justify-center mx-auto mb-6">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#d4c5a9]" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
              </svg>
            </div>

            <h3 className="font-[family-name:var(--font-display)] text-3xl text-white mb-3 leading-none">
              Join the Community
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Subscribe for early access to drops, exclusive releases, and{' '}
              <strong className="text-white">10% off your first order.</strong>
            </p>

            {submitSuccess ? (
              <div className="text-[#d4c5a9] font-semibold text-sm">
                Sei dentro. Benvenuto in NOCTRL.
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  placeholder="La tua email"
                  required
                  className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm text-center outline-none focus:border-[#d4c5a9]/50 transition-colors placeholder:text-gray-600"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#d4c5a9] text-[#0a0a0a] font-bold py-4 rounded-xl transition-all hover:bg-[#e8dcc8] disabled:opacity-50 uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Iscrizione in corso...
                    </>
                  ) : (
                    "Get 10% Off"
                  )}
                </button>
                {submitError && <p className="text-red-500 text-xs">{submitError}</p>}
              </form>
            )}

            <p className="text-[0.55rem] text-gray-600 mt-4">Niente spam. Ti cancelli quando vuoi.</p>
            <button onClick={onClose} className="text-[0.6rem] text-gray-500 underline hover:text-gray-300 mt-4 transition-colors">
              No grazie, mi tengo il rischio
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
