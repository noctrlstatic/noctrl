"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Minus, Plus, Trash2, Truck, ArrowRight, Loader2, Tag } from "lucide-react";

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  cartTotal,
  cartCount,
  onRemove,
  onUpdateQty,
  shipping,
  onShippingChange,
  onCheckout,
  checkoutLoading,
  checkoutError,
  onClearError,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-md bg-[#111] border-l border-white/[0.06] h-full relative z-10 flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-white/[0.04] flex items-center justify-between bg-[#0a0a0a]">
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-white tracking-wide">Cart</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <ShoppingBag size={40} className="mb-4 text-gray-600" />
                  <p className="font-bold uppercase tracking-widest text-xs text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-white/[0.03] p-4 rounded-2xl border border-white/[0.04]">
                    <div className="w-20 h-24 relative rounded-xl overflow-hidden bg-black flex-shrink-0">
                      <Image
                        src={item.images?.[0] || item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-semibold text-white pr-3 truncate">{item.name}</h4>
                          <button
                            onClick={() => onRemove(item.id)}
                            className="text-gray-500 hover:text-red-500 flex-shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <span className="text-[0.5rem] font-bold text-[#d4c5a9] uppercase tracking-widest">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex items-end justify-between mt-2">
                        <div className="flex items-center bg-black rounded-lg border border-white/10 p-0.5">
                          <button
                            onClick={() => onUpdateQty(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-white">{item.cartQty}</span>
                          <button
                            onClick={() => onUpdateQty(item.id, 1)}
                            disabled={item.cartQty >= item.quantity}
                            className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded disabled:opacity-30"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="font-[family-name:var(--font-display)] text-lg text-white">
                          €{(item.price * item.cartQty).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/[0.04] bg-[#0a0a0a]">
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Truck size={14} className="text-[#d4c5a9]" />
                    <span className="text-[0.55rem] font-bold uppercase tracking-widest text-gray-400">
                      Dettagli Spedizione
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      placeholder="Nome e Cognome"
                      value={shipping.name}
                      onChange={(e) => onShippingChange({ ...shipping, name: e.target.value })}
                      className="sm:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#d4c5a9]/50 transition-colors placeholder:text-gray-600"
                    />
                    <input
                      type="text"
                      placeholder="Indirizzo"
                      value={shipping.address}
                      onChange={(e) => onShippingChange({ ...shipping, address: e.target.value })}
                      className="sm:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#d4c5a9]/50 transition-colors placeholder:text-gray-600"
                    />
                    <input
                      type="text"
                      placeholder="Città"
                      value={shipping.city}
                      onChange={(e) => onShippingChange({ ...shipping, city: e.target.value })}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#d4c5a9]/50 transition-colors placeholder:text-gray-600"
                    />
                    <input
                      type="text"
                      placeholder="CAP"
                      value={shipping.zip}
                      onChange={(e) => onShippingChange({ ...shipping, zip: e.target.value })}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#d4c5a9]/50 transition-colors placeholder:text-gray-600"
                    />
                    <input
                      type="tel"
                      placeholder="Telefono"
                      value={shipping.phone}
                      onChange={(e) => onShippingChange({ ...shipping, phone: e.target.value })}
                      className="sm:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#d4c5a9]/50 transition-colors placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4 p-3 bg-[#d4c5a9]/10 border border-[#d4c5a9]/20 rounded-xl">
                  <Tag size={14} className="text-[#d4c5a9] flex-shrink-0" />
                  <p className="text-[0.6rem] text-gray-400 leading-relaxed">
                    Usa il codice <span className="text-[#d4c5a9] font-bold tracking-wider">NOCTRL10</span> al checkout per <span className="text-white">10% di sconto</span>
                  </p>
                </div>

                <div className="flex justify-between items-center mb-5">
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">Totale</span>
                  <span className="font-[family-name:var(--font-display)] text-2xl text-white">
                    €{cartTotal.toFixed(2)}
                  </span>
                </div>

              {checkoutError && (
                <p className="text-red-400 text-xs text-center mb-2">{checkoutError}</p>
              )}
              <button
                onClick={onCheckout}
                disabled={checkoutLoading}
                className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-[#d4c5a9] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkoutLoading ? (
                  <><Loader2 size={16} className="animate-spin" /> Elaborazione...</>
                ) : (
                  <><ShoppingBag size={16} /> Vai al pagamento — €{cartTotal.toFixed(2)}</>
                )}
              </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
