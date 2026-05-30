"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchOverlay({
  isOpen,
  searchQuery,
  onSearchChange,
  searchResults,
  onSelectProduct,
  onClose,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-start justify-center pt-24 px-4"
        >
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="w-full max-w-xl bg-[#111] border border-white/5 rounded-2xl shadow-2xl overflow-hidden relative z-10"
          >
            <div className="p-4 border-b border-white/5">
              <input
                type="text"
                placeholder="Cerca prodotti..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#d4c5a9]/50 transition-colors placeholder:text-gray-600"
                autoFocus
              />
            </div>
            <div className="max-h-80 overflow-y-auto">
              {searchQuery.trim() === "" ? (
                <div className="p-6 text-center text-gray-500 text-sm">Scrivi per cercare...</div>
              ) : searchResults.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">Nessun risultato trovato.</div>
              ) : (
                searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/[0.03] transition-colors text-left border-b border-white/5 last:border-0"
                  >
                    <div className="w-12 h-16 relative rounded-lg overflow-hidden bg-black flex-shrink-0">
                      <Image
                        src={product.images?.[0] || product.image}
                        alt={product.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-white truncate">{product.name}</div>
                      <div className="text-[10px] font-bold text-[#d4c5a9] uppercase tracking-widest mt-0.5">
                        {product.category}
                      </div>
                      <div className="font-bold text-sm text-white mt-0.5">€{product.price.toFixed(2)}</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
