"use client";

import Image from "next/image";
import { Package, AlertTriangle, Plus, Edit2, Trash2, Loader2 } from "lucide-react";

export default function ProductTable({
  products, loading, error, onRefresh, onOpenAddModal, onOpenEditModal,
  onDeleteClick, onAdjustStock, stockUpdatingId
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem]">
        <Loader2 size={40} className="text-[#00ff80] animate-spin mb-4" />
        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Caricamento del database in corso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24 bg-[#0a0a0a] border border-red-500/10 rounded-[2.5rem]">
        <AlertTriangle size={40} className="text-red-500 mx-auto mb-4" />
        <p className="text-red-400 font-bold mb-4 uppercase tracking-widest">{error}</p>
        <button onClick={onRefresh} className="bg-white/5 border border-white/10 hover:border-white/20 px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider">Riprova</button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-24 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem]">
        <Package size={40} className="text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 font-bold mb-6 uppercase tracking-widest">Nessun prodotto trovato nel database.</p>
        <button onClick={onOpenAddModal} className="bg-[#00ff80] text-black px-8 py-3 rounded-xl font-bold text-sm">Crea Primo Prodotto</button>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-8 pt-6 pb-2">
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{products.length} prodotti nel catalogo</span>
        <button onClick={onOpenAddModal} className="bg-[#00ff80] text-black px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,255,128,0.3)] transition-all flex items-center gap-2">
          <Plus size={14} />
          Aggiungi Prodotto
        </button>
      </div>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500 bg-[#050505]/50">
              <th className="py-6 pl-8">Prodotto</th>
              <th className="py-6">Categoria</th>
              <th className="py-6">Prezzo</th>
              <th className="py-6">Disponibilità (Magazzino)</th>
              <th className="py-6">Badge</th>
              <th className="py-6 pr-8 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-medium">
            {products.map((product) => {
              const mainImage = product.images && product.images.length > 0 ? product.images[0] : product.image;
              return (
                <tr key={product.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="py-5 pl-8">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-16 rounded-xl overflow-hidden border border-white/5 bg-[#050505]">
                        <Image
                          src={mainImage}
                          alt={product.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-white group-hover:text-[#00ff80] transition-colors">{product.name}</h4>
                        <span className="text-[10px] text-gray-600 font-bold">ID: #{product.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-5">
                    <span className="text-[10px] font-bold text-[#00ff80] bg-[#00ff80]/5 border border-[#00ff80]/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {product.category}
                    </span>
                  </td>

                  <td className="py-5">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-white">€{product.price.toFixed(2)}</span>
                      {product.oldPrice && (
                        <span className="text-xs text-gray-500 line-through">€{product.oldPrice.toFixed(2)}</span>
                      )}
                    </div>
                  </td>

                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-black border border-white/5 rounded-xl p-1">
                        <button
                          onClick={() => onAdjustStock(product, -1)}
                          disabled={product.quantity === 0 || stockUpdatingId === product.id}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white disabled:text-gray-700 disabled:cursor-not-allowed hover:bg-white/5 rounded-lg transition-colors font-extrabold text-lg select-none"
                        >
                          -
                        </button>

                        <span className={`w-10 text-center font-bold font-mono text-sm ${
                          product.quantity === 0 ? "text-red-500" : product.quantity <= 3 ? "text-yellow-500" : "text-white"
                        }`}>
                          {stockUpdatingId === product.id ? (
                            <Loader2 size={12} className="animate-spin mx-auto text-[#00ff80]" />
                          ) : (
                            product.quantity
                          )}
                        </span>

                        <button
                          onClick={() => onAdjustStock(product, 1)}
                          disabled={stockUpdatingId === product.id}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white disabled:text-gray-700 hover:bg-white/5 rounded-lg transition-colors font-extrabold text-lg select-none"
                        >
                          +
                        </button>
                      </div>

                      {product.quantity === 0 ? (
                        <span className="text-[9px] font-black text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded uppercase tracking-tighter">Esaurito</span>
                      ) : product.quantity <= 3 ? (
                        <span className="text-[9px] font-black text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded uppercase tracking-tighter">Pezzi Rimasti</span>
                      ) : (
                        <span className="text-[9px] font-black text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded uppercase tracking-tighter">Disponibile</span>
                      )}
                    </div>
                  </td>

                  <td className="py-5">
                    {product.isNew ? (
                      <span className="text-[9px] font-black text-black bg-[#00ff80] px-2 py-0.5 rounded uppercase tracking-tighter">Nuovo</span>
                    ) : (
                      <span className="text-[9px] font-bold text-gray-600">—</span>
                    )}
                  </td>

                  <td className="py-5 pr-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onOpenEditModal(product)}
                        className="w-9 h-9 rounded-xl border border-white/5 hover:border-white/20 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                        title="Modifica Prodotto"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => onDeleteClick(product)}
                        className="w-9 h-9 rounded-xl border border-red-500/5 hover:border-red-500/30 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                        title="Elimina Prodotto"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="md:hidden divide-y divide-white/5">
        {products.map((product) => {
          const mainImage = product.images && product.images.length > 0 ? product.images[0] : product.image;
          return (
            <div key={product.id} className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-20 rounded-xl overflow-hidden border border-white/5 bg-[#050505] flex-shrink-0">
                  <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-bold text-white truncate text-lg">{product.name}</h4>
                    {product.isNew && (
                      <span className="text-[9px] font-black text-black bg-[#00ff80] px-1.5 py-0.5 rounded uppercase flex-shrink-0">New</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-black text-[#00ff80] uppercase tracking-wider">{product.category}</span>
                    <span className="text-[10px] text-gray-600">ID: #{product.id}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-extrabold text-white text-lg">€{product.price.toFixed(2)}</span>
                    {product.oldPrice && (
                      <span className="text-xs text-gray-500 line-through">€{product.oldPrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded-2xl p-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Disponibilità:</span>
                  <div className="flex items-center bg-black border border-white/10 rounded-lg p-0.5">
                    <button
                      onClick={() => onAdjustStock(product, -1)}
                      disabled={product.quantity === 0 || stockUpdatingId === product.id}
                      className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white disabled:text-gray-700 disabled:cursor-not-allowed font-extrabold text-sm select-none"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold font-mono text-xs">
                      {stockUpdatingId === product.id ? (
                        <Loader2 size={10} className="animate-spin mx-auto text-[#00ff80]" />
                      ) : (
                        product.quantity
                      )}
                    </span>
                    <button
                      onClick={() => onAdjustStock(product, 1)}
                      disabled={stockUpdatingId === product.id}
                      className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white disabled:text-gray-700 font-extrabold text-sm select-none"
                    >
                      +
                    </button>
                  </div>
                </div>

                {product.quantity === 0 ? (
                  <span className="text-[9px] font-black text-red-500 uppercase">Esaurito</span>
                ) : product.quantity <= 3 ? (
                  <span className="text-[9px] font-black text-yellow-500 uppercase">Pochi Pezzi</span>
                ) : (
                  <span className="text-[9px] font-black text-emerald-400 uppercase">Disponibile</span>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => onOpenEditModal(product)}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 text-gray-300"
                >
                  <Edit2 size={12} />
                  Modifica
                </button>
                <button
                  onClick={() => onDeleteClick(product)}
                  className="px-4 bg-red-500/10 border border-red-500/20 py-2.5 rounded-xl text-red-400 hover:text-red-300 flex items-center justify-center"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
