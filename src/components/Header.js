"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, User, X, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header({
  scrolled,
  isSearchOpen,
  setIsSearchOpen,
  searchQuery,
  setSearchQuery,
  searchResults,
  setSelectedProduct,
  cartCount,
  setIsCartOpen,
}) {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-header py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="text-3xl font-[family-name:var(--font-display)] tracking-[0.08em] text-white leading-none">
          NOCTRL
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-gray-400">
          <a href="#countdown" className="hover:text-white transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[#d4c5a9] after:transition-all hover:after:w-full">
            New Drop
          </a>
          <a href="#products" className="hover:text-white transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[#d4c5a9] after:transition-all hover:after:w-full">
            Shop
          </a>
          <a href="#lifestyle" className="hover:text-white transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[#d4c5a9] after:transition-all hover:after:w-full">
            Lifestyle
          </a>
          <a href="#story" className="hover:text-white transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[#d4c5a9] after:transition-all hover:after:w-full">
            Story
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="relative search-container">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-400 hover:text-white transition-colors">
              <Search size={18} />
            </button>
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-3 w-80 bg-[#111] border border-white/5 rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-white/5">
                    <input
                      type="text"
                      placeholder="Cerca prodotti..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#d4c5a9]/50 transition-colors placeholder:text-gray-600"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {searchQuery.trim() === "" ? (
                      <div className="p-6 text-center text-gray-500 text-sm">Scrivi per cercare...</div>
                    ) : searchResults.length === 0 ? (
                      <div className="p-6 text-center text-gray-500 text-sm">Nessun risultato trovato.</div>
                    ) : (
                      searchResults.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsSearchOpen(false);
                            setSearchQuery("");
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
              )}
            </AnimatePresence>
          </div>

          <button onClick={() => setIsCartOpen(true)} className="text-gray-400 hover:text-white transition-colors relative">
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#d4c5a9] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <a href="https://www.instagram.com/_noctrl_static/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#d4c5a9] transition-colors">
            <Instagram size={18} />
          </a>
          <Link href="/admin" className="text-gray-400 hover:text-[#d4c5a9] transition-colors">
            <User size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
