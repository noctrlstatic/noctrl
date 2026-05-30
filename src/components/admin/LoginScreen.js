"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Lock, ArrowRight, ArrowLeft } from "lucide-react";

export default function LoginScreen({ password, onPasswordChange, authError, rememberMe, onRememberMeChange, onLogin }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 px-6"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full max-w-md p-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#00ff80]/10 blur-[40px] rounded-full"></div>

        <div className="flex flex-col items-center text-center relative z-10">
          <div className="w-16 h-16 rounded-full bg-[#00ff80] flex items-center justify-center shadow-[0_0_30px_rgba(0,255,128,0.4)] mb-6">
            <Lock size={28} className="text-black" />
          </div>

          <h1 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
            NOCTRL <span className="text-sm font-bold text-[#00ff80] uppercase tracking-widest ml-2 border border-[#00ff80]/20 px-2 py-0.5 rounded">Admin</span>
          </h1>

          <p className="text-gray-400 text-sm mb-8 font-medium">
            Inserisci la password amministratore per sbloccare la gestione dei prodotti e del magazzino.
          </p>

          <form onSubmit={onLogin} className="w-full space-y-6">
            <div className="space-y-2 text-left">
              <label className="text-xs font-bold uppercase tracking-widest text-[#00ff80]">Password o PIN</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-[#00ff80] outline-none rounded-2xl px-5 py-4 text-center font-bold tracking-widest text-lg transition-colors placeholder:text-white/20"
                autoFocus
              />
              {authError && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs font-bold uppercase tracking-wider mt-1 text-center"
                >
                  {authError}
                </motion.p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
              <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => onRememberMeChange(e.target.checked)}
                  className="accent-[#00ff80] w-4 h-4 rounded"
                />
                Ricordami su questo browser
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#00ff80] text-black shadow-[0_0_20px_rgba(0,255,128,0.2)] hover:shadow-[0_0_30px_rgba(0,255,128,0.5)] font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              Sblocca Dashboard
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8">
            <Link href="/" className="text-gray-500 hover:text-[#00ff80] text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
              <ArrowLeft size={14} />
              Torna al Negozio
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
