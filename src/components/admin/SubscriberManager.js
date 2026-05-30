"use client";

import { Mail, Search, Download, Trash2, Loader2 } from "lucide-react";

export default function SubscriberManager({
  subscribers, loading, searchQuery, onSearchChange,
  onDelete, onExport
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem]">
        <Loader2 size={40} className="text-[#00ff80] animate-spin mb-4" />
        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Caricamento lead...</p>
      </div>
    );
  }

  const filteredSubscribers = subscribers.filter(sub =>
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-[#050505] border border-white/5 p-4 rounded-3xl">
        <div className="flex items-center gap-3 pl-2 w-full sm:w-auto">
          <div className="w-8 h-8 rounded-lg bg-[#00ff80]/10 border border-[#00ff80]/20 flex items-center justify-center text-[#00ff80]">
            <Mail size={16} />
          </div>
          <span className="text-sm font-bold uppercase tracking-wider text-gray-400">Database Leads Network</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Cerca email..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-black border border-white/10 focus:border-[#00ff80] outline-none rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-white transition-all placeholder:text-gray-600 placeholder:uppercase"
            />
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
          </div>

          <button
            onClick={onExport}
            className="w-full sm:w-auto bg-[#00ff80]/10 hover:bg-[#00ff80] border border-[#00ff80]/30 hover:text-black text-[#00ff80] font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all text-xs uppercase tracking-wider"
          >
            <Download size={14} />
            Esporta CSV
          </button>
        </div>
      </div>

      {subscribers.length === 0 ? (
        <div className="text-center py-24 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem]">
          <Mail size={40} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 font-bold mb-2 uppercase tracking-widest">Nessun lead iscritto al network.</p>
          <p className="text-gray-600 text-xs font-medium">I nuovi lead appariranno qui non appena gli utenti si registrano dal pop-up.</p>
        </div>
      ) : (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest bg-black/40">
                  <th className="py-6 px-8 text-left">Email</th>
                  <th className="py-6 px-8 text-left">ID Iscritto</th>
                  <th className="py-6 px-8 text-left">Data Iscrizione</th>
                  <th className="py-6 px-8 text-right">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSubscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="py-6 px-8">
                      <div className="font-extrabold text-white text-sm">{sub.email}</div>
                    </td>
                    <td className="py-6 px-8">
                      <code className="text-xs font-mono text-[#00ff80] bg-[#00ff80]/5 px-2.5 py-1 rounded border border-[#00ff80]/10">
                        {sub.id}
                      </code>
                    </td>
                    <td className="py-6 px-8">
                      <div className="text-xs text-gray-400 font-semibold">
                        {new Date(sub.date).toLocaleString('it-IT', { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <button
                        onClick={() => onDelete(sub.id)}
                        className="p-3 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-400 rounded-xl transition-all inline-flex items-center"
                        title="Elimina Lead"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-white/5">
            {filteredSubscribers.map((sub) => (
              <div key={sub.id} className="p-6 flex flex-col gap-4 bg-black/20">
                <div className="flex justify-between items-start gap-4">
                  <div className="font-extrabold text-white text-sm break-all">{sub.email}</div>
                  <button
                    onClick={() => onDelete(sub.id)}
                    className="p-2.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-400 rounded-xl transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-3 items-center justify-between text-xs pt-2 border-t border-white/5">
                  <div>
                    <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-1">ID LEAD</div>
                    <code className="text-[10px] font-mono text-[#00ff80] bg-[#00ff80]/5 px-2 py-0.5 rounded border border-[#00ff80]/10">
                      {sub.id}
                    </code>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-1">DATA ISCRIZIONE</div>
                    <span className="text-gray-400 font-semibold">{new Date(sub.date).toLocaleDateString('it-IT')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
