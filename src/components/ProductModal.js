"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";

export default function ProductModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  const mainImage = product.images && product.images.length > 0 ? product.images[0] : product.image;

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
          />
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            className="w-full max-w-5xl bg-[#111] border border-white/[0.06] rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors z-20"
            >
              <X size={16} />
            </button>

            <div className="w-full md:w-1/2 bg-black relative min-h-[300px] md:min-h-[500px]">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              {product.images && product.images.length > 1 && (
                <div className="absolute bottom-5 left-5 right-5 flex gap-2 overflow-x-auto no-scrollbar">
                  {product.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="w-14 h-18 relative rounded-lg overflow-hidden border-2 border-transparent hover:border-[#d4c5a9] cursor-pointer flex-shrink-0 bg-black transition-colors"
                    >
                      <Image src={img} alt={`Thumb ${idx}`} fill sizes="56px" className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-10 overflow-y-auto flex flex-col">
              <div className="mb-6">
                <span className="inline-block text-[0.5rem] font-bold text-[#d4c5a9] uppercase tracking-widest mb-3">
                  {product.category}
                </span>
                <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-white leading-tight mb-3">
                  {product.name}
                </h2>
                <div className="flex items-baseline gap-3">
                  <span className="font-[family-name:var(--font-display)] text-3xl text-white">
                    €{product.price.toFixed(2)}
                  </span>
                  {product.oldPrice && (
                    <span className="text-lg text-gray-600 line-through">
                      €{product.oldPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-8">
                <p className="text-sm text-gray-400 leading-relaxed">
                  Premium quality piece. Authenticity guaranteed. Perfect for elevating your
                  everyday style.
                </p>
              </div>

              <div className="mt-auto space-y-5">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      product.quantity > 0 ? "bg-[#d4c5a9]" : "bg-red-500"
                    }`}
                  />
                  <span className="text-[0.55rem] font-semibold uppercase tracking-widest text-gray-400">
                    {product.quantity > 0
                      ? `${product.quantity} units available`
                      : "Sold Out"}
                  </span>
                </div>

                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  disabled={product.quantity === 0}
                  className="w-full bg-white text-[#0a0a0a] font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 hover:bg-[#d4c5a9] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xs"
                >
                  {product.quantity === 0 ? "Sold Out" : "Add to Cart"}
                  <ShoppingBag size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
