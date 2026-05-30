"use client";

import { Loader2, AlertTriangle } from "lucide-react";
import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
  loading,
  filteredProducts,
  filterCategory,
  setFilterCategory,
  sortOrder,
  setSortOrder,
  categories,
  onSelectProduct,
  onAddToCart,
}) {
  return (
    <section id="products" className="py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <span className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-[#d4c5a9] block mb-4">
            Featured Drop
          </span>
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(3rem,8vw,7rem)] leading-[0.95] text-white">
            Essential <span className="text-[#d4c5a9]">Collection</span>
          </h2>
          <p className="text-gray-400 max-w-lg mt-4 leading-relaxed">
            Curated pieces for the new season. Limited quantities available.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem]">
            <Loader2 size={32} className="text-[#d4c5a9] animate-spin mb-4" />
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Loading...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem]">
            <AlertTriangle size={32} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No products found.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
              <div className="flex gap-2 bg-white/[0.03] border border-white/5 rounded-xl p-1 overflow-x-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-[0.6rem] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                      filterCategory === cat
                        ? "bg-[#d4c5a9] text-black"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-[0.65rem] font-bold uppercase tracking-wider outline-none focus:border-[#d4c5a9]/50 transition-colors appearance-none cursor-pointer text-center"
              >
                <option className="bg-[#0a0a0a]" value="Latest">Latest</option>
                <option className="bg-[#0a0a0a]" value="Price Low">Price Low</option>
                <option className="bg-[#0a0a0a]" value="Price High">Price High</option>
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onSelect={onSelectProduct}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
