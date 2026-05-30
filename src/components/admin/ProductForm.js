"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { X, Loader2, Save, Image as ImageIcon } from "lucide-react";

export default function ProductForm({
  isOpen, onClose, editingProduct, formName, onFormNameChange,
  formPrice, onFormPriceChange, formOldPrice, onFormOldPriceChange,
  formCategory, onFormCategoryChange, formQuantity, onFormQuantityChange,
  formIsNew, onFormIsNewChange, formImages, onFormImagesChange,
  formImageUrl, onFormImageUrlChange, uploadingFiles,
  onFileUpload, onAddImageUrl, onRemoveImage, onSubmit, submitting
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      ></motion.div>

      <motion.div
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 250 }}
        className="w-full max-w-2xl bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden z-10"
      >
        <div className="flex justify-between items-center p-8 border-b border-white/5">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight italic">
              {editingProduct ? "Modifica Prodotto" : "Nuovo Prodotto"}
            </h3>
            <p className="text-gray-500 text-xs mt-1">
              {editingProduct ? `Aggiorna i dettagli per l'ID #${editingProduct.id}` : "Inserisci un nuovo modello nel catalogo digitale."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-white/10 hover:border-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all bg-white/5"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="p-8 max-h-[60vh] overflow-y-auto space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#00ff80]">Nome Prodotto *</label>
              <input
                type="text"
                required
                placeholder="es. Vintage Oversized Hoodie"
                value={formName}
                onChange={(e) => onFormNameChange(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-[#00ff80] outline-none rounded-xl px-4 py-3 text-white font-medium transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#00ff80]">Categoria *</label>
                <select
                  value={formCategory}
                  onChange={(e) => onFormCategoryChange(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#00ff80] outline-none rounded-xl px-4 py-3 text-white font-medium transition-colors appearance-none cursor-pointer"
                >
                  <option value="Outerwear">Outerwear</option>
                  <option value="T-Shirts">T-Shirts</option>
                  <option value="Bottoms">Bottoms</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Borraccia">Borraccia (Water Bottle)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#00ff80]">Disponibilità in Magazzino *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formQuantity}
                  onChange={(e) => onFormQuantityChange(parseInt(e.target.value) || 0)}
                  className="w-full bg-white/5 border border-white/10 focus:border-[#00ff80] outline-none rounded-xl px-4 py-3 text-white font-medium transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#00ff80]">Prezzo (€) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="89.90"
                  value={formPrice}
                  onChange={(e) => onFormPriceChange(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-[#00ff80] outline-none rounded-xl px-4 py-3 text-white font-medium transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Prezzo Originale / Scontato (€)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="129.90 (Lascia vuoto se nessun sconto)"
                  value={formOldPrice}
                  onChange={(e) => onFormOldPriceChange(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-[#00ff80] outline-none rounded-xl px-4 py-3 text-white font-medium transition-colors"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-[#00ff80]">Immagini Prodotto *</label>

              <div className="flex flex-wrap gap-3">
                {formImages.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-xl border border-white/10 overflow-hidden bg-[#050505] group">
                    <Image src={img} alt="Preview" fill sizes="96px" className="object-cover" />
                    <button
                      type="button"
                      onClick={() => onRemoveImage(idx)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}

                <label className="relative w-24 h-24 rounded-xl border-2 border-dashed border-white/20 hover:border-[#00ff80]/50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-white/5">
                  {uploadingFiles ? <Loader2 size={20} className="animate-spin text-[#00ff80]" /> : <ImageIcon size={20} className="text-gray-400" />}
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest text-center px-1">
                    {uploadingFiles ? 'Upload...' : 'Carica da PC'}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={onFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploadingFiles}
                  />
                </label>
              </div>

              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Oppure inserisci URL immagine (https://...)"
                  value={formImageUrl}
                  onChange={(e) => onFormImageUrlChange(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onAddImageUrl(); } }}
                  className="flex-1 bg-white/5 border border-white/10 focus:border-[#00ff80] outline-none rounded-xl px-4 py-3 text-white font-medium transition-colors text-xs"
                />
                <button
                  type="button"
                  onClick={onAddImageUrl}
                  className="bg-white/10 hover:bg-white/20 px-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                >
                  Aggiungi
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 py-2 border-t border-white/5 pt-4">
              <input
                type="checkbox"
                id="formIsNew"
                checked={formIsNew}
                onChange={(e) => onFormIsNewChange(e.target.checked)}
                className="accent-[#00ff80] w-5 h-5 rounded cursor-pointer"
              />
              <label htmlFor="formIsNew" className="font-bold text-sm text-white select-none cursor-pointer">
                Segna come <span className="bg-[#00ff80] text-black text-[10px] font-black px-2 py-0.5 rounded ml-1 uppercase">Nuovo Arrivo</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 p-8 border-t border-white/5 bg-[#050505]/50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3.5 border border-white/10 hover:border-white/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#00ff80] text-black shadow-[0_0_20px_rgba(0,255,128,0.2)] hover:shadow-[0_0_30px_rgba(0,255,128,0.5)] font-bold px-8 py-3.5 rounded-xl flex items-center gap-2 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs uppercase tracking-widest"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Salvataggio...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Salva Prodotto
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
