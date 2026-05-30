"use client";

import Link from "next/link";
import { ShoppingBag, ArrowLeft, LogOut } from "lucide-react";

export default function AdminHeader({ onLogout, stats }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-white/5 pb-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#00ff80]/10 border border-[#00ff80]/20 flex items-center justify-center text-[#00ff80]">
          <ShoppingBag size={22} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black tracking-tight uppercase italic">Pannello Controllo</h1>
            <span className="text-[10px] font-black bg-[#00ff80]/15 text-[#00ff80] px-2 py-0.5 rounded border border-[#00ff80]/20 uppercase tracking-widest not-italic">BackOffice</span>
          </div>
          <p className="text-gray-500 font-medium mt-1">Gestisci la disponibilità e i prodotti visibili in tempo reale sullo store.</p>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto">
        <Link href="/" className="flex-1 md:flex-none px-6 py-3.5 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl text-xs font-bold uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2">
          <ArrowLeft size={16} />
          Vedi Negozio
        </Link>
        <button
          onClick={onLogout}
          className="px-4 py-3.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
          title="Disconnetti"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Esci</span>
        </button>
      </div>
    </div>
  );
}
