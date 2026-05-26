"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ShoppingBag, 
  Plus, 
  Edit2, 
  Trash2, 
  Lock, 
  ArrowLeft, 
  Save, 
  X, 
  Package, 
  AlertTriangle, 
  CheckCircle,
  Loader2,
  Image as ImageIcon,
  DollarSign,
  Layers,
  ArrowRight,
  LogOut,
  Mail,
  Download,
  Search,
  Truck,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Products and operation states
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modals & Action states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  
  // Stock quick adjustment loading IDs
  const [stockUpdatingId, setStockUpdatingId] = useState(null);

  // Marketing Newsletter leads tab states
  const [activeTab, setActiveTab] = useState("prodotti"); // "prodotti" o "leads" o "ordini"
  const [subscribers, setSubscribers] = useState([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);
  const [subscribersSearch, setSubscribersSearch] = useState("");

  // Orders management
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [editingTracking, setEditingTracking] = useState(null);
  const [trackingValue, setTrackingValue] = useState("");

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formOldPrice, setFormOldPrice] = useState("");
  const [formCategory, setFormCategory] = useState("Outerwear");
  const [formImages, setFormImages] = useState([]);
  const [formImageUrl, setFormImageUrl] = useState("");
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [formQuantity, setFormQuantity] = useState(10);
  const [formIsNew, setFormIsNew] = useState(false);

  // Check local storage for previous auth session
  useEffect(() => {
    const savedAuth = localStorage.getItem("revive_admin_authenticated");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch products and subscribers once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
      fetchSubscribers();
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrders(data.sort((a, b) => b.id - a.id));
    } catch (err) {
      console.error("Errore fetchOrders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchSubscribers = async () => {
    setLoadingSubscribers(true);
    try {
      const res = await fetch("/api/subscribers");
      if (!res.ok) throw new Error("Errore durante il caricamento dei lead");
      const data = await res.json();
      setSubscribers(data);
    } catch (err) {
      console.error("Errore fetchSubscribers:", err);
    } finally {
      setLoadingSubscribers(false);
    }
  };

  const handleDeleteSubscriber = async (subId) => {
    if (!confirm("Sei sicuro di voler rimuovere questo lead dal database?")) return;
    try {
      const res = await fetch(`/api/subscribers?id=${subId}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error();
      setSubscribers(prev => prev.filter(s => s.id !== subId));
      showSuccessMessage("Lead rimosso dal network con successo.");
    } catch (err) {
      alert("Impossibile rimuovere il lead.");
    }
  };

  const handleExportCSV = () => {
    if (subscribers.length === 0) {
      alert("Nessun lead presente da esportare.");
      return;
    }
    const headers = "ID,Email,Data Iscrizione\n";
    const rows = subscribers.map(s => `${s.id},${s.email},${s.date}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `subscribers_network_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccessMessage("Database leads esportato correttamente in CSV!");
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus })
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      showSuccessMessage("Stato ordine aggiornato!");
    } catch (err) {
      alert("Errore aggiornamento stato.");
    }
  };

  const handleSaveTracking = async (orderId) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, tracking: trackingValue })
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      setEditingTracking(null);
      showSuccessMessage("Tracking aggiornato!");
    } catch (err) {
      alert("Errore salvataggio tracking.");
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Errore durante il caricamento dei prodotti");
      const data = await res.json();
      // Ordina i prodotti per ID decrescente in modo da vedere prima i nuovi
      setProducts(data.sort((a, b) => b.id - a.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Default passcodes: '1234' or 'admin123'
    if (password === "Cosimoricci2004") {
      setIsAuthenticated(true);
      setAuthError("");
      if (rememberMe) {
        localStorage.setItem("revive_admin_authenticated", "true");
      }
    } else {
      setAuthError("Codice di accesso non valido. Riprova.");
      setPassword("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("revive_admin_authenticated");
  };

  // Open modal for adding a new product
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormPrice("");
    setFormOldPrice("");
    setFormCategory("Outerwear");
    setFormImages([]);
    setFormImageUrl("");
    setFormQuantity(10);
    setFormIsNew(true);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing product
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormPrice(product.price.toString());
    setFormOldPrice(product.oldPrice ? product.oldPrice.toString() : "");
    setFormCategory(product.category);
    setFormImages(product.images || (product.image ? [product.image] : []));
    setFormImageUrl("");
    setFormQuantity(product.quantity);
    setFormIsNew(product.isNew || false);
    setIsModalOpen(true);
  };

  // Quick adjust product stock inline
  const handleAdjustStock = async (product, amount) => {
    const newQty = Math.max(0, product.quantity + amount);
    if (newQty === product.quantity) return; // Non scendere sotto lo zero

    setStockUpdatingId(product.id);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty })
      });
      if (!res.ok) throw new Error();
      
      const updated = await res.json();
      setProducts(prev => prev.map(p => p.id === product.id ? updated : p));
    } catch (err) {
      // Fallback in caso di errore
      alert("Impossibile aggiornare la quantità in magazzino.");
    } finally {
      setStockUpdatingId(null);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingFiles(true);
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      if (!res.ok) throw new Error("Errore durante l'upload");
      const data = await res.json();
      if (data.urls) {
        setFormImages(prev => [...prev, ...data.urls]);
      }
    } catch (err) {
      alert("Impossibile caricare le immagini: " + err.message);
    } finally {
      setUploadingFiles(false);
      // Reset input value to allow uploading the same file again if needed
      e.target.value = null;
    }
  };

  const handleAddImageUrl = () => {
    if (formImageUrl.trim()) {
      setFormImages(prev => [...prev, formImageUrl.trim()]);
      setFormImageUrl("");
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Submit product creation or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formName || !formPrice || formImages.length === 0) {
      alert("Compila tutti i campi obbligatori (Nome, Prezzo) e aggiungi almeno un'immagine");
      return;
    }

    setSubmitting(true);
    const payload = {
      name: formName,
      price: parseFloat(formPrice),
      oldPrice: formOldPrice ? parseFloat(formOldPrice) : null,
      category: formCategory,
      images: formImages,
      quantity: parseInt(formQuantity),
      isNew: formIsNew
    };

    try {
      let res;
      if (editingProduct) {
        // Aggiorna
        res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        // Crea
        res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) throw new Error("Errore nel salvataggio");
      
      const savedProduct = await res.json();
      
      if (editingProduct) {
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? savedProduct : p));
        showSuccessMessage("Prodotto aggiornato con successo!");
      } else {
        setProducts(prev => [savedProduct, ...prev]);
        showSuccessMessage("Nuovo prodotto aggiunto con successo!");
      }
      
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete product
  const handleDelete = async () => {
    if (!deletingProduct) return;
    
    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${deletingProduct.id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Errore durante l'eliminazione");
      
      setProducts(prev => prev.filter(p => p.id !== deletingProduct.id));
      showSuccessMessage("Prodotto eliminato correttamente.");
      setDeletingProduct(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const showSuccessMessage = (message) => {
    setActionSuccess(message);
    setTimeout(() => {
      setActionSuccess(null);
    }, 4000);
  };

  // Calculate statistics
  const stats = {
    totalProducts: products.length,
    totalStock: products.reduce((acc, p) => acc + p.quantity, 0),
    outOfStock: products.filter(p => p.quantity === 0).length,
    lowStock: products.filter(p => p.quantity > 0 && p.quantity <= 3).length,
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#00ff80] selection:text-black overflow-x-hidden relative">
      
      {/* Decorative Glow Elements */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00ff80]/5 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00ff80]/3 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Lock Screen / Login Panel */}
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div 
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 px-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md p-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 shadow-2xl relative overflow-hidden"
            >
              {/* Background accent inside the card */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#00ff80]/10 blur-[40px] rounded-full"></div>
              
              <div className="flex flex-col items-center text-center relative z-10">
                {/* Logo */}
                <div className="w-16 h-16 rounded-full bg-[#00ff80] flex items-center justify-center shadow-[0_0_30px_rgba(0,255,128,0.4)] mb-6">
                  <Lock size={28} className="text-black" />
                </div>
                
                <h1 className="text-2xl font-black uppercase tracking-tight italic text-white mb-2">
                  Revive<span className="font-light text-gray-400">Resell</span> <span className="text-sm font-bold text-[#00ff80] uppercase tracking-widest not-italic ml-2 border border-[#00ff80]/20 px-2 py-0.5 rounded">Admin</span>
                </h1>
                
                <p className="text-gray-400 text-sm mb-8 font-medium">
                  Inserisci la password amministratore per sbloccare la gestione dei prodotti e del magazzino.
                </p>

                <form onSubmit={handleLogin} className="w-full space-y-6">
                  <div className="space-y-2 text-left">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#00ff80]">Password o PIN</label>
                    <input 
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 focus:border-[#00ff80] outline-none rounded-2xl px-5 py-4 text-center font-bold tracking-widest text-lg transition-colors placeholder:text-white/20"
                      autoFocus
                    />
                    {authError && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-xs font-bold uppercase tracking-wider mt-1 text-center"
                      >
                        {authError}
                      </motion.p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors select-none">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="accent-[#00ff80] w-4 h-4 rounded"
                      />
                      Ricordami su questo browser
                    </label>

                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#00ff80] text-black shadow-[0_0_20px_rgba(0,255,128,0.2)] hover:shadow-[0_0_30px_rgba(0,255,128,0.5)] font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                  >
                    Sblocca Dashboard
                    <ArrowRight size={18} />
                  </button>
                </form>

                <div className="mt-8">
                  <Link href="/" className="text-gray-500 hover:text-[#00ff80] text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
                    <ArrowLeft size={14} />
                    Torna al Negozio
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          /* Admin Dashboard Content */
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-6 py-12 relative z-10"
          >
            
            {/* Success Toast */}
            <AnimatePresence>
              {actionSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -50, x: "-50%" }}
                  animate={{ opacity: 1, y: 0, x: "-50%" }}
                  exit={{ opacity: 0, y: -20, x: "-50%" }}
                  className="fixed top-8 left-1/2 z-50 bg-[#00ff80] text-black font-bold px-8 py-4 rounded-2xl shadow-[0_0_30px_rgba(0,255,128,0.3)] flex items-center gap-3"
                >
                  <CheckCircle size={20} />
                  {actionSuccess}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
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
                  onClick={handleLogout}
                  className="px-4 py-3.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  title="Disconnetti"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Esci</span>
                </button>
              </div>
            </div>

            {/* Stats Dashboard Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
              
              {/* Stat 1 */}
              <div className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 flex flex-col justify-between hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Totale Prodotti</span>
                  <div className="w-8 h-8 rounded-lg bg-[#00ff80]/5 flex items-center justify-center text-[#00ff80]"><Package size={16} /></div>
                </div>
                <div>
                  <h3 className="text-3xl md:text-4xl font-extrabold">{loading ? "..." : stats.totalProducts}</h3>
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider mt-1">Modelli in catalogo</p>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 flex flex-col justify-between hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Disponibilità Totale</span>
                  <div className="w-8 h-8 rounded-lg bg-[#00ff80]/5 flex items-center justify-center text-[#00ff80]"><Layers size={16} /></div>
                </div>
                <div>
                  <h3 className="text-3xl md:text-4xl font-extrabold">{loading ? "..." : stats.totalStock}</h3>
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider mt-1">Pezzi totali in magazzino</p>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 flex flex-col justify-between hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Esauriti</span>
                  <div className="w-8 h-8 rounded-lg bg-red-500/5 flex items-center justify-center text-red-500"><AlertTriangle size={16} /></div>
                </div>
                <div>
                  <h3 className={`text-3xl md:text-4xl font-extrabold ${stats.outOfStock > 0 ? "text-red-500" : ""}`}>{loading ? "..." : stats.outOfStock}</h3>
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider mt-1">Prodotti fuori stock</p>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 flex flex-col justify-between hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Scorte Basse</span>
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/5 flex items-center justify-center text-yellow-500"><AlertTriangle size={16} /></div>
                </div>
                <div>
                  <h3 className={`text-3xl md:text-4xl font-extrabold ${stats.lowStock > 0 ? "text-yellow-500" : ""}`}>{loading ? "..." : stats.lowStock}</h3>
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider mt-1">Meno di 3 pezzi rimasti</p>
                </div>
              </div>

            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
              <button 
                onClick={() => setActiveTab("prodotti")}
                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === "prodotti" 
                    ? "bg-[#00ff80] text-black shadow-[0_0_20px_rgba(0,255,128,0.3)]" 
                    : "bg-white/5 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white"
                }`}
              >
                Catalogo Prodotti ({stats.totalProducts})
              </button>
              <button 
                onClick={() => setActiveTab("leads")}
                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === "leads" 
                    ? "bg-[#00ff80] text-black shadow-[0_0_20px_rgba(0,255,128,0.3)]" 
                    : "bg-white/5 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white"
                }`}
              >
                Network Leads ({subscribers.length})
              </button>
              <button 
                onClick={() => setActiveTab("ordini")}
                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === "ordini" 
                    ? "bg-[#00ff80] text-black shadow-[0_0_20px_rgba(0,255,128,0.3)]" 
                    : "bg-white/5 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white"
                }`}
              >
                Ordini ({orders.length})
              </button>
            </div>

            {activeTab === "prodotti" ? (
              <>
                {/* Catalog Controls / Search Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-[#050505] border border-white/5 p-4 rounded-3xl">
                  <span className="text-sm font-bold uppercase tracking-wider text-gray-400 pl-2">Catalogo Dynamic Database</span>
                  
                  <button 
                    onClick={handleOpenAddModal}
                    className="w-full sm:w-auto bg-[#00ff80] text-black shadow-[0_0_20px_rgba(0,255,128,0.2)] hover:shadow-[0_0_30px_rgba(0,255,128,0.5)] font-bold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all text-sm"
                  >
                    <Plus size={18} />
                    Aggiungi Nuovo Prodotto
                  </button>
                </div>

                {/* Loading/Error State or Products List */}
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-24 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem]">
                    <Loader2 size={40} className="text-[#00ff80] animate-spin mb-4" />
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Caricamento del database in corso...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-24 bg-[#0a0a0a] border border-red-500/10 rounded-[2.5rem]">
                    <AlertTriangle size={40} className="text-red-500 mx-auto mb-4" />
                    <p className="text-red-400 font-bold mb-4 uppercase tracking-widest">{error}</p>
                    <button onClick={fetchProducts} className="bg-white/5 border border-white/10 hover:border-white/20 px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider">Riprova</button>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-24 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem]">
                    <Package size={40} className="text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 font-bold mb-6 uppercase tracking-widest">Nessun prodotto trovato nel database.</p>
                    <button onClick={handleOpenAddModal} className="bg-[#00ff80] text-black px-8 py-3 rounded-xl font-bold text-sm">Crea Primo Prodotto</button>
                  </div>
                ) : (
                  /* Product Table/Cards */
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    
                    {/* Desktop and Tablet Table */}
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
                          {products.map((product) => (
                            <tr key={product.id} className="hover:bg-white/[0.01] transition-colors group">
                              {/* Image and Name */}
                              <td className="py-5 pl-8">
                                <div className="flex items-center gap-4">
                                  <div className="relative w-12 h-16 rounded-xl overflow-hidden border border-white/5 bg-[#050505]">
                                    <Image 
                                      src={product.image} 
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

                              {/* Category */}
                              <td className="py-5">
                                <span className="text-[10px] font-bold text-[#00ff80] bg-[#00ff80]/5 border border-[#00ff80]/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                  {product.category}
                                </span>
                              </td>

                              {/* Price */}
                              <td className="py-5">
                                <div className="flex flex-col">
                                  <span className="font-extrabold text-white">€{product.price.toFixed(2)}</span>
                                  {product.oldPrice && (
                                    <span className="text-xs text-gray-500 line-through">€{product.oldPrice.toFixed(2)}</span>
                                  )}
                                </div>
                              </td>

                              {/* Quantity Stock Control */}
                              <td className="py-5">
                                <div className="flex items-center gap-3">
                                  
                                  {/* Stock Adjust UI */}
                                  <div className="flex items-center bg-black border border-white/5 rounded-xl p-1">
                                    <button 
                                      onClick={() => handleAdjustStock(product, -1)}
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
                                      onClick={() => handleAdjustStock(product, 1)}
                                      disabled={stockUpdatingId === product.id}
                                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white disabled:text-gray-700 hover:bg-white/5 rounded-lg transition-colors font-extrabold text-lg select-none"
                                    >
                                      +
                                    </button>
                                  </div>

                                  {/* Stock Badge */}
                                  {product.quantity === 0 ? (
                                    <span className="text-[9px] font-black text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded uppercase tracking-tighter">Esaurito</span>
                                  ) : product.quantity <= 3 ? (
                                    <span className="text-[9px] font-black text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded uppercase tracking-tighter">Pezzi Rimasti</span>
                                  ) : (
                                    <span className="text-[9px] font-black text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded uppercase tracking-tighter">Disponibile</span>
                                  )}
                                </div>
                              </td>

                              {/* Badges (isNew) */}
                              <td className="py-5">
                                {product.isNew ? (
                                  <span className="text-[9px] font-black text-black bg-[#00ff80] px-2 py-0.5 rounded uppercase tracking-tighter">Nuovo</span>
                                ) : (
                                  <span className="text-[9px] font-bold text-gray-600">—</span>
                                )}
                              </td>

                              {/* Actions */}
                              <td className="py-5 pr-8 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button 
                                    onClick={() => handleOpenEditModal(product)}
                                    className="w-9 h-9 rounded-xl border border-white/5 hover:border-white/20 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                                    title="Modifica Prodotto"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button 
                                    onClick={() => setDeletingProduct(product)}
                                    className="w-9 h-9 rounded-xl border border-red-500/5 hover:border-red-500/30 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                                    title="Elimina Prodotto"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile View Card List */}
                    <div className="md:hidden divide-y divide-white/5">
                      {products.map((product) => (
                        <div key={product.id} className="p-6 flex flex-col gap-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-20 rounded-xl overflow-hidden border border-white/5 bg-[#050505] flex-shrink-0">
                              <Image 
                                src={product.image} 
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

                          {/* Control Panel in card */}
                          <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded-2xl p-3">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Disponibilità:</span>
                              <div className="flex items-center bg-black border border-white/10 rounded-lg p-0.5">
                                <button 
                                  onClick={() => handleAdjustStock(product, -1)}
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
                                  onClick={() => handleAdjustStock(product, 1)}
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
                              onClick={() => handleOpenEditModal(product)}
                              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 text-gray-300"
                            >
                              <Edit2 size={12} />
                              Modifica
                            </button>
                            <button 
                              onClick={() => setDeletingProduct(product)}
                              className="px-4 bg-red-500/10 border border-red-500/20 py-2.5 rounded-xl text-red-400 hover:text-red-300 flex items-center justify-center"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                )}
              </>
              ) : activeTab === "leads" ? (
              <>
                {/* Leads Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-[#050505] border border-white/5 p-4 rounded-3xl">
                  <div className="flex items-center gap-3 pl-2 w-full sm:w-auto">
                    <div className="w-8 h-8 rounded-lg bg-[#00ff80]/10 border border-[#00ff80]/20 flex items-center justify-center text-[#00ff80]">
                      <Mail size={16} />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wider text-gray-400">Database Leads Network</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
                    {/* Leads Search */}
                    <div className="relative w-full sm:w-64">
                      <input 
                        type="text"
                        placeholder="Cerca email..."
                        value={subscribersSearch}
                        onChange={(e) => setSubscribersSearch(e.target.value)}
                        className="w-full bg-black border border-white/10 focus:border-[#00ff80] outline-none rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-white transition-all placeholder:text-gray-600 placeholder:uppercase"
                      />
                      <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                    </div>

                    <button 
                      onClick={handleExportCSV}
                      className="w-full sm:w-auto bg-[#00ff80]/10 hover:bg-[#00ff80] border border-[#00ff80]/30 hover:text-black text-[#00ff80] font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all text-xs uppercase tracking-wider"
                    >
                      <Download size={14} />
                      Esporta CSV
                    </button>
                  </div>
                </div>

                {/* Subscribers List Content */}
                {loadingSubscribers ? (
                  <div className="flex flex-col items-center justify-center py-24 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem]">
                    <Loader2 size={40} className="text-[#00ff80] animate-spin mb-4" />
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Caricamento lead...</p>
                  </div>
                ) : subscribers.length === 0 ? (
                  <div className="text-center py-24 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem]">
                    <Mail size={40} className="text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 font-bold mb-2 uppercase tracking-widest">Nessun lead iscritto al network.</p>
                    <p className="text-gray-600 text-xs font-medium">I nuovi lead appariranno qui non appena gli utenti si registrano dal pop-up.</p>
                  </div>
                ) : (
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden">
                    {/* Desktop Table */}
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
                          {subscribers
                            .filter(sub => sub.email.toLowerCase().includes(subscribersSearch.toLowerCase()))
                            .map((sub) => (
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
                                  <div className="text-xs text-gray-400 font-semibold">{new Date(sub.date).toLocaleString('it-IT', {dateStyle: 'medium', timeStyle: 'short'})}</div>
                                </td>
                                <td className="py-6 px-8 text-right">
                                  <button 
                                    onClick={() => handleDeleteSubscriber(sub.id)}
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

                    {/* Mobile/Tablet Card List */}
                    <div className="md:hidden divide-y divide-white/5">
                      {subscribers
                        .filter(sub => sub.email.toLowerCase().includes(subscribersSearch.toLowerCase()))
                        .map((sub) => (
                          <div key={sub.id} className="p-6 flex flex-col gap-4 bg-black/20">
                            <div className="flex justify-between items-start gap-4">
                              <div className="font-extrabold text-white text-sm break-all">{sub.email}</div>
                              <button 
                                onClick={() => handleDeleteSubscriber(sub.id)}
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
            ) : (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-[#050505] border border-white/5 p-4 rounded-3xl">
                  <span className="text-sm font-bold uppercase tracking-wider text-gray-400 pl-2">Gestione Ordini</span>
                </div>

                {loadingOrders ? (
                  <div className="flex flex-col items-center justify-center py-24 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem]">
                    <Loader2 size={40} className="text-[#00ff80] animate-spin mb-4" />
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Caricamento ordini...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-24 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem]">
                    <Truck size={40} className="text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest">Nessun ordine ancora ricevuto.</p>
                  </div>
                ) : (
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden">
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500 bg-[#050505]/50">
                            <th className="py-6 pl-8">Ordine</th>
                            <th className="py-6">Cliente</th>
                            <th className="py-6">Articoli</th>
                            <th className="py-6">Totale</th>
                            <th className="py-6">Data</th>
                            <th className="py-6">Stato</th>
                            <th className="py-6">Tracking</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {orders.map(order => (
                            <tr key={order.id} className="hover:bg-white/[0.01] transition-colors">
                              <td className="py-5 pl-8">
                                <span className="font-bold text-white">#{order.id}</span>
                              </td>
                              <td className="py-5">
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-bold text-sm text-white">{order.shipping.name}</span>
                                  <span className="text-xs text-gray-500">{order.shipping.address}, {order.shipping.city} - {order.shipping.zip}</span>
                                  <span className="text-xs text-gray-400">{order.shipping.phone}</span>
                                </div>
                              </td>
                              <td className="py-5">
                                <div className="flex flex-col gap-1">
                                  {order.items.map((item, idx) => (
                                    <span key={idx} className="text-xs text-gray-300">
                                      {item.name} x{item.cartQty}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="py-5">
                                <span className="font-extrabold text-white">€{order.total.toFixed(2)}</span>
                              </td>
                              <td className="py-5">
                                <span className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString('it-IT', {dateStyle: 'medium', timeStyle: 'short'})}</span>
                              </td>
                              <td className="py-5">
                                <select
                                  value={order.status}
                                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                  className="bg-black border border-white/10 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-[#00ff80]/50 cursor-pointer"
                                >
                                  <option className="bg-black" value="In elaborazione">In elaborazione</option>
                                  <option className="bg-black" value="Spedito">Spedito</option>
                                  <option className="bg-black" value="Consegnato">Consegnato</option>
                                </select>
                              </td>
                              <td className="py-5 pr-8">
                                {editingTracking === order.id ? (
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={trackingValue}
                                      onChange={(e) => setTrackingValue(e.target.value)}
                                      placeholder="N. tracking"
                                      className="w-28 bg-black border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#00ff80]/50"
                                      autoFocus
                                    />
                                    <button onClick={() => handleSaveTracking(order.id)} className="text-[#00ff80] hover:text-white text-xs font-bold">Salva</button>
                                    <button onClick={() => setEditingTracking(null)} className="text-gray-500 hover:text-white text-xs">X</button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    {order.tracking ? (
                                      <span className="text-xs font-mono text-[#00ff80] bg-[#00ff80]/5 px-2 py-1 rounded border border-[#00ff80]/10">{order.tracking}</span>
                                    ) : (
                                      <span className="text-xs text-gray-600">—</span>
                                    )}
                                    <button onClick={() => { setEditingTracking(order.id); setTrackingValue(order.tracking || ""); }} className="text-gray-500 hover:text-white text-xs font-bold">Modifica</button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile view */}
                    <div className="md:hidden divide-y divide-white/5">
                      {orders.map(order => (
                        <div key={order.id} className="p-6 space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-white text-lg">#{order.id}</span>
                            <span className="font-extrabold text-white">€{order.total.toFixed(2)}</span>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{order.shipping.name}</div>
                            <div className="text-xs text-gray-500">{order.shipping.address}, {order.shipping.city} - {order.shipping.zip}</div>
                            <div className="text-xs text-gray-400">{order.shipping.phone}</div>
                          </div>
                          <div className="text-xs text-gray-300">
                            {order.items.map((item, idx) => (
                              <div key={idx}>{item.name} x{item.cartQty}</div>
                            ))}
                          </div>
                          <div className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString('it-IT', {dateStyle: 'medium'})}</div>
                          <div className="flex items-center justify-between gap-2">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="flex-1 bg-black border border-white/10 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-[#00ff80]/50 cursor-pointer"
                            >
                              <option className="bg-black" value="In elaborazione">In elaborazione</option>
                              <option className="bg-black" value="Spedito">Spedito</option>
                              <option className="bg-black" value="Consegnato">Consegnato</option>
                            </select>
                            {editingTracking === order.id ? (
                              <div className="flex items-center gap-1">
                                <input type="text" value={trackingValue} onChange={(e) => setTrackingValue(e.target.value)} className="w-20 bg-black border border-white/10 rounded-xl px-2 py-2 text-xs outline-none" />
                                <button onClick={() => handleSaveTracking(order.id)} className="text-[#00ff80] text-xs font-bold">OK</button>
                              </div>
                            ) : (
                              <button onClick={() => { setEditingTracking(order.id); setTrackingValue(order.tracking || ""); }} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                                <Truck size={12} />
                                {order.tracking || "Tracking"}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREATE / EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            ></motion.div>

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 250 }}
              className="w-full max-w-2xl bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden z-10"
            >
              
              {/* Header */}
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
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-full border border-white/10 hover:border-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all bg-white/5"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit}>
                <div className="p-8 max-h-[60vh] overflow-y-auto space-y-6">
                  
                  {/* Name field */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#00ff80]">Nome Prodotto *</label>
                    <input 
                      type="text"
                      required
                      placeholder="es. Vintage Oversized Hoodie"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 focus:border-[#00ff80] outline-none rounded-xl px-4 py-3 text-white font-medium transition-colors"
                    />
                  </div>

                  {/* Twin fields: Category and Image */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Category field */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#00ff80]">Categoria *</label>
                      <select 
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#00ff80] outline-none rounded-xl px-4 py-3 text-white font-medium transition-colors appearance-none cursor-pointer"
                      >
                        <option value="Outerwear">Outerwear</option>
                        <option value="T-Shirts">T-Shirts</option>
                        <option value="Bottoms">Bottoms</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Borraccia">Borraccia (Water Bottle)</option>
                      </select>
                    </div>

                    {/* Quantity field */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#00ff80]">Disponibilità in Magazzino *</label>
                      <input 
                        type="number"
                        min="0"
                        required
                        value={formQuantity}
                        onChange={(e) => setFormQuantity(parseInt(e.target.value) || 0)}
                        className="w-full bg-white/5 border border-white/10 focus:border-[#00ff80] outline-none rounded-xl px-4 py-3 text-white font-medium transition-colors"
                      />
                    </div>
                  </div>

                  {/* Twin fields: Price and OldPrice */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Price field */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#00ff80]">Prezzo (€) *</label>
                      <input 
                        type="number"
                        step="0.01"
                        min="0.01"
                        required
                        placeholder="89.90"
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 focus:border-[#00ff80] outline-none rounded-xl px-4 py-3 text-white font-medium transition-colors"
                      />
                    </div>

                    {/* Old Price field */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Prezzo Originale / Scontato (€)</label>
                      <input 
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="129.90 (Lascia vuoto se nessun sconto)"
                        value={formOldPrice}
                        onChange={(e) => setFormOldPrice(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 focus:border-[#00ff80] outline-none rounded-xl px-4 py-3 text-white font-medium transition-colors"
                      />
                    </div>
                  </div>

                  {/* Immagini Prodotto Multiplo */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#00ff80]">Immagini Prodotto *</label>
                    
                    <div className="flex flex-wrap gap-3">
                      {formImages.map((img, idx) => (
                        <div key={idx} className="relative w-24 h-24 rounded-xl border border-white/10 overflow-hidden bg-[#050505] group">
                          <Image src={img} alt="Preview" fill sizes="96px" className="object-cover" />
                          <button 
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      
                      {/* Bottone Upload PC */}
                      <label className="relative w-24 h-24 rounded-xl border-2 border-dashed border-white/20 hover:border-[#00ff80]/50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-white/5">
                        {uploadingFiles ? <Loader2 size={20} className="animate-spin text-[#00ff80]" /> : <ImageIcon size={20} className="text-gray-400" />}
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest text-center px-1">
                          {uploadingFiles ? 'Upload...' : 'Carica da PC'}
                        </span>
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*"
                          onChange={handleFileUpload}
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
                        onChange={(e) => setFormImageUrl(e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddImageUrl(); } }}
                        className="flex-1 bg-white/5 border border-white/10 focus:border-[#00ff80] outline-none rounded-xl px-4 py-3 text-white font-medium transition-colors text-xs"
                      />
                      <button 
                        type="button"
                        onClick={handleAddImageUrl}
                        className="bg-white/10 hover:bg-white/20 px-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                      >
                        Aggiungi
                      </button>
                    </div>
                  </div>

                  {/* Switch isNew */}
                  <div className="flex items-center gap-4 py-2 border-t border-white/5 pt-4">
                    <input 
                      type="checkbox" 
                      id="isNew"
                      checked={formIsNew}
                      onChange={(e) => setFormIsNew(e.target.checked)}
                      className="accent-[#00ff80] w-5 h-5 rounded cursor-pointer"
                    />
                    <label htmlFor="isNew" className="font-bold text-sm text-white select-none cursor-pointer">
                      Segna come <span className="bg-[#00ff80] text-black text-[10px] font-black px-2 py-0.5 rounded ml-1 uppercase">Nuovo Arrivo</span>
                    </label>
                  </div>

                </div>

                {/* Footer buttons */}
                <div className="flex items-center justify-end gap-4 p-8 border-t border-white/5 bg-[#050505]/50">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
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
        )}
      </AnimatePresence>

      {/* CONFIRM DELETE MODAL */}
      <AnimatePresence>
        {deletingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingProduct(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            ></motion.div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#0a0a0a] border border-red-500/10 rounded-[2rem] shadow-2xl p-8 relative z-10 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto mb-6">
                <Trash2 size={22} />
              </div>

              <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-2">Eliminare Prodotto?</h3>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                Sei sicuro di voler rimuovere permanentemente <span className="text-white font-bold font-mono">&ldquo;{deletingProduct.name}&rdquo;</span>? Questa azione è irreversibile.
              </p>

              <div className="flex gap-4">
                <button 
                  onClick={() => setDeletingProduct(null)}
                  disabled={submitting}
                  className="flex-1 py-3.5 border border-white/10 hover:border-white/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                >
                  Annulla
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={submitting}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                >
                  {submitting ? (
                    <Loader2 size={14} className="animate-spin mx-auto" />
                  ) : (
                    "Conferma ed Elimina"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
