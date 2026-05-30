"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Heart } from "lucide-react";
import { useState, useEffect } from "react";

const LIKED_KEY = "noctrl_liked";

function getLiked() {
  try {
    return JSON.parse(localStorage.getItem(LIKED_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function ProductCard({ product, index, onSelect, onAddToCart }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(getLiked().includes(product.id));
  }, [product.id]);

  const toggleLike = (e) => {
    e.stopPropagation();
    const current = getLiked();
    const updated = current.includes(product.id)
      ? current.filter((id) => id !== product.id)
      : [...current, product.id];
    localStorage.setItem(LIKED_KEY, JSON.stringify(updated));
    setLiked(!liked);
  };

  const mainImage = product.images && product.images.length > 0 ? product.images[0] : product.image;
  const hoverImage = product.images && product.images.length > 1 ? product.images[1] : mainImage;

  return (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (index % 4) * 0.08, duration: 0.5 }}
      className="product-card group cursor-pointer rounded-2xl bg-[#0d0d0d] border border-white/[0.04] hover:border-[#d4c5a9]/30 hover:shadow-[0_0_30px_rgba(212,197,169,0.08)] transition-all hover:-translate-y-1 overflow-hidden"
      onClick={() => onSelect(product)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#111]">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        <Image
          src={hoverImage}
          alt={product.name + " detail"}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100 scale-105 group-hover:scale-100"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.quantity > 0 && product.quantity <= 3 && (
            <span className="bg-red-600 text-white text-[0.5rem] font-bold px-2.5 py-1 rounded uppercase tracking-wider shadow-lg">
              Only {product.quantity} left
            </span>
          )}
          {product.isNew && (
            <span className="bg-[#d4c5a9] text-black text-[0.5rem] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
              New
            </span>
          )}
          {product.oldPrice && (
            <span className="bg-white text-black text-[0.5rem] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
              Sale
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            disabled={product.quantity === 0}
            className={`w-full py-3 rounded-lg text-[0.6rem] font-bold uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-2 ${
              product.quantity === 0
                ? "bg-white/10 text-gray-500 cursor-not-allowed"
                : "bg-white/90 text-black backdrop-blur-sm hover:bg-white"
            }`}
          >
            {product.quantity === 0 ? "Sold Out" : "Quick Add"}
            <ShoppingBag size={14} />
          </button>
        </div>

        <button
          onClick={toggleLike}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center transition-colors z-10"
        >
          <Heart size={14} className={liked ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-white"} />
        </button>
      </div>

      <div className="p-4">
        <div className="text-[0.55rem] font-bold text-[#d4c5a9] uppercase tracking-widest mb-1">
          {product.category}
        </div>
        <h3 className="text-sm font-semibold text-white truncate">{product.name}</h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-[family-name:var(--font-display)] text-lg text-white tracking-wide">
            €{product.price.toFixed(2)}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-gray-600 line-through">
              €{product.oldPrice.toFixed(2)}
            </span>
          )}
        </div>
        {product.quantity > 0 && product.quantity <= 5 && (
          <div className="text-[0.5rem] font-semibold uppercase tracking-wider text-red-500 mt-1.5">
            Low stock — only {product.quantity} left
          </div>
        )}
      </div>
    </motion.div>
  );
}
