"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, ArrowRight, CheckCircle2, Search, User, Filter, Tag, Instagram, Loader2, AlertTriangle, X, Mail, Bell, Copy, Check, Send, Plus, Minus, Trash2, CreditCard, Truck } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FashionResalePlatform() {
  const [scrolled, setScrolled] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cart & Modals
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Filter & Sort
  const [filterCategory, setFilterCategory] = useState("Tutti");
  const [sortOrder, setSortOrder] = useState("Più Recenti");

  // Marketing and loyalty program states
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showEmailNotification, setShowEmailNotification] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [shipping, setShipping] = useState({
    name: "", address: "", city: "", zip: "", phone: ""
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      const saved = localStorage.getItem("pending_order");
      if (saved) {
        const orderData = JSON.parse(saved);
        fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: saved
        }).then(() => {
          localStorage.removeItem("pending_order");
          setOrderSuccess(true);
          setCartItems([]);
          window.history.replaceState({}, "", "/");
        }).catch(() => {});
      } else {
        setOrderSuccess(true);
        window.history.replaceState({}, "", "/");
      }
    }
  }, []);

  const handleCheckout = async () => {
    if (!shipping.name || !shipping.address || !shipping.city || !shipping.zip || !shipping.phone) {
      alert("Compila tutti i campi di spedizione prima di procedere.");
      return;
    }
    setCheckoutLoading(true);
    const orderData = { items: cartItems, shipping, total: cartTotal };
    localStorage.setItem("pending_order", JSON.stringify(orderData));
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Errore: " + (data.error || "Riprova più tardi"));
      }
    } catch (err) {
      alert("Errore di connessione. Riprova.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText("WELCOME10");
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const closePopup = () => {
    setShowPopup(false);
    sessionStorage.setItem("newsletter_popup_dismissed", "true");
  };

  useEffect(() => {
    const dismissed = sessionStorage.getItem("newsletter_popup_dismissed");
    const subscribed = localStorage.getItem("newsletter_subscribed");
    if (dismissed || subscribed) return;
    const timer = setTimeout(() => setShowPopup(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("newsletter_popup_dismissed");
    const subscribed = localStorage.getItem("newsletter_subscribed");
    if (dismissed || subscribed) return;

    const handleMouseLeave = (e) => {
      if (e.clientY < 20) {
        setShowPopup(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.trim()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() })
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitSuccess(true);
        setSubscribedEmail(email.trim());
        localStorage.setItem("newsletter_subscribed", "true");
        setShowPopup(false);
        setTimeout(() => setShowEmailNotification(true), 1000);
      } else {
        setSubmitError(data.error || "Qualcosa è andato storto. Riprova.");
      }
    } catch (err) {
      setSubmitError("Errore di rete. Controlla la connessione.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Errore nel caricamento dei prodotti:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Cart Functions
  const addToCart = (product) => {
    if (product.quantity === 0) return;
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, cartQty: Math.min(item.cartQty + 1, product.quantity) } 
            : item
        );
      }
      return [...prev, { ...product, cartQty: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQty = (productId, amount) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, Math.min(item.cartQty + amount, item.quantity));
        return { ...item, cartQty: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.cartQty), 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.cartQty, 0);

  // Filter & Sort Logic
  const filteredProducts = products.filter(p => {
    if (filterCategory === "Tutti") return true;
    return p.category === filterCategory;
  }).sort((a, b) => {
    if (sortOrder === "Prezzo Crescente") return a.price - b.price;
    if (sortOrder === "Prezzo Decrescente") return b.price - a.price;
    return b.id - a.id; // Più Recenti
  });

  const categories = ["Tutti", ...new Set(products.map(p => p.category))];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#00ff80] selection:text-black overflow-x-hidden relative">
      
      {orderSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-[#00ff80] text-black font-bold px-8 py-5 rounded-2xl shadow-[0_0_40px_rgba(0,255,128,0.4)] flex items-center gap-3 text-sm sm:text-base">
          <CheckCircle2 size={24} />
          Ordine confermato! Riceverai aggiornamenti sulla spedizione via email.
          <button onClick={() => setOrderSuccess(false)} className="ml-4 p-1 hover:bg-black/10 rounded-full"><X size={18} /></button>
        </div>
      )}

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-header py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#00ff80] flex items-center justify-center shadow-[0_0_15px_rgba(0,255,128,0.3)]">
              <ShoppingBag size={18} className="text-black" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white uppercase italic">Revive<span className="font-light text-gray-400">Resell</span></span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-gray-400">
            <a href="#prodotti" className="hover:text-[#00ff80] transition-colors">Nuovi Arrivi</a>
            <a href="#prodotti" className="hover:text-[#00ff80] transition-colors">Collezione</a>
            <a href="#" className="hover:text-[#00ff80] transition-colors">About</a>
          </nav>

          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-white transition-colors">
              <Search size={20} />
            </button>
            <button onClick={() => setIsCartOpen(true)} className="text-gray-400 hover:text-white transition-colors relative">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#00ff80] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <Link href="/admin" className="hidden sm:block text-gray-400 hover:text-[#00ff80] transition-colors" title="Area Riservata Amministratore">
              <User size={20} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/bottle_lifestyle.png')] bg-cover bg-center opacity-30 grayscale"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full text-center mt-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00ff80]/10 border border-[#00ff80]/20 text-[#00ff80] text-[10px] font-bold uppercase tracking-widest mb-8 animate-fade-in">
            <Tag size={12} />
            Nuovo Drop Premium Disponibile
          </div>
          <h1 className="text-6xl sm:text-7xl lg:text-9xl font-extrabold leading-[1.1] tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 uppercase">
            Define Your <br/>Style.
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12 font-medium">
            Selezione curata di streetwear esclusivo e accessori premium innovativi, come la nostra nuova Borraccia Termica Intelligente.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
            <a href="#prodotti" className="bg-[#00ff80] text-black shadow-[0_0_30px_rgba(0,255,128,0.4)] px-10 py-5 rounded-full font-bold text-lg transition-all hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(0,255,128,0.6)] flex items-center gap-3 group">
              Esplora Collezione
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="py-24 relative z-20 border-t border-white/5" id="prodotti">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white tracking-tight">Catalogo Selezione.</h2>
              <p className="text-gray-500 font-medium">Tutti gli articoli sono autenticati e pronti per la spedizione.</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl p-1 overflow-x-auto">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${filterCategory === cat ? 'bg-[#00ff80] text-black' : 'text-gray-400 hover:text-white'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider outline-none focus:border-[#00ff80]/50 transition-colors appearance-none cursor-pointer"
              >
                <option className="bg-black" value="Più Recenti">Più Recenti</option>
                <option className="bg-black" value="Prezzo Crescente">Prezzo Crescente</option>
                <option className="bg-black" value="Prezzo Decrescente">Prezzo Decrescente</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-[#050505] border border-white/5 rounded-[2.5rem]">
              <Loader2 size={36} className="text-[#00ff80] animate-spin mb-4" />
              <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Caricamento vetrina...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-24 bg-[#050505] border border-white/5 rounded-[2.5rem]">
              <AlertTriangle size={36} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 font-bold uppercase tracking-widest">Nessun prodotto trovato.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {filteredProducts.map((product) => {
                const mainImage = (product.images && product.images.length > 0) ? product.images[0] : product.image;
                const hoverImage = (product.images && product.images.length > 1) ? product.images[1] : mainImage;

                return (
                  <div key={product.id} className="group flex flex-col cursor-pointer" onClick={() => setSelectedProduct(product)}>
                    <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-[#0a0a0a] border border-white/5 shadow-2xl transition-all duration-500 group-hover:border-[#00ff80]/30">
                      
                      <Image 
                        src={mainImage} 
                        alt={product.name}
                        fill
                        className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                      />
                      <Image 
                        src={hoverImage} 
                        alt={product.name + " alternate"}
                        fill
                        className="object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100 scale-105 group-hover:scale-100"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                        {product.quantity === 0 && (
                          <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-[0_0_15px_rgba(239,68,68,0.4)]">Esaurito</span>
                        )}
                        {product.quantity > 0 && product.quantity <= 3 && (
                          <span className="bg-yellow-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-[0_0_15px_rgba(234,179,8,0.4)]">Solo {product.quantity} rimasti</span>
                        )}
                        {product.isNew && product.quantity > 0 && (
                          <span className="bg-[#00ff80] text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">Nuovo</span>
                        )}
                      </div>

                      {/* Add to cart hover button */}
                      <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                        <button 
                          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                          disabled={product.quantity === 0}
                          className={`w-full font-bold py-4 rounded-2xl shadow-2xl flex items-center justify-center gap-2 transition-colors ${product.quantity === 0 ? 'bg-white/10 text-gray-500 cursor-not-allowed' : 'bg-white text-black hover:bg-[#00ff80]'}`}
                        >
                          {product.quantity === 0 ? "Non Disponibile" : "Aggiungi al Carrello"}
                          <ShoppingBag size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-start pt-6 px-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-[#00ff80] uppercase tracking-widest mb-1">{product.category}</span>
                        <h3 className="text-xl font-bold text-white group-hover:text-[#00ff80] transition-colors">{product.name}</h3>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`text-xl font-bold ${product.quantity === 0 ? 'text-gray-500 line-through' : 'text-white'}`}>
                          €{product.price.toFixed(2)}
                        </span>
                        {product.oldPrice && product.quantity > 0 && (
                          <span className="text-xs text-gray-500 line-through">€{product.oldPrice.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Values / Why Shop With Us */}
      <section className="py-24 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div className="flex flex-col gap-6 p-10 bg-black/40 border border-white/5 rounded-[2.5rem] hover:border-[#00ff80]/20 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#00ff80]/10 border border-[#00ff80]/20 flex items-center justify-center text-[#00ff80]">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white">Qualità Garantita</h3>
            <p className="text-gray-500 font-medium leading-relaxed">Ogni prodotto, dall'abbigliamento alle borracce smart, è accuratamente selezionato e testato.</p>
          </div>
          <div className="flex flex-col gap-6 p-10 bg-black/40 border border-white/5 rounded-[2.5rem] hover:border-[#00ff80]/20 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#00ff80]/10 border border-[#00ff80]/20 flex items-center justify-center text-[#00ff80]">
              <ArrowRight size={24} className="rotate-[-45deg]" />
            </div>
            <h3 className="text-2xl font-bold text-white">Spedizione Espresso</h3>
            <p className="text-gray-500 font-medium leading-relaxed">Consegna rapida in tutta Italia con tracciabilità in tempo reale.</p>
          </div>
          <div className="flex flex-col gap-6 p-10 bg-black/40 border border-white/5 rounded-[2.5rem] hover:border-[#00ff80]/20 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#00ff80]/10 border border-[#00ff80]/20 flex items-center justify-center text-[#00ff80]">
              <Instagram size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white">Community Driven</h3>
            <p className="text-gray-500 font-medium leading-relaxed">Unisciti a migliaia di appassionati di stile e sostenibilità nel nostro network.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 bg-black border-t border-white/5 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 rounded-full bg-[#00ff80] flex items-center justify-center">
                  <ShoppingBag size={18} className="text-black" />
                </div>
                <span className="font-bold text-xl tracking-tight text-white uppercase italic">Revive<span className="font-light text-gray-400">Resell</span></span>
              </div>
              <p className="text-gray-500 max-w-sm mb-8 font-medium leading-relaxed">
                La destinazione premium per abbigliamento esclusivo e accessori all'avanguardia.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold uppercase tracking-widest text-xs text-[#00ff80] mb-8">Shop</h4>
              <ul className="space-y-4 text-sm font-bold text-gray-400">
                <li><a href="#" className="hover:text-white transition-all">Tutti i Prodotti</a></li>
                <li><a href="#" className="hover:text-white transition-all">Streetwear</a></li>
                <li><a href="#" className="hover:text-white transition-all">Accessori</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold uppercase tracking-widest text-xs text-[#00ff80] mb-8">Informazioni</h4>
              <ul className="space-y-4 text-sm font-bold text-gray-400">
                <li><a href="#" className="hover:text-white transition-all">Spedizioni & Resi</a></li>
                <li><Link href="/admin" className="hover:text-[#00ff80] transition-all">Area Riservata</Link></li>
                <li><a href="#" className="hover:text-white transition-all">Contatti</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* --- CART DRAWER MODAL --- */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-[#0a0a0a] border-l border-white/10 h-full relative z-10 flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black">
                <div className="flex items-center gap-3">
                  <ShoppingBag size={20} className="text-[#00ff80]" />
                  <h2 className="text-xl font-black uppercase tracking-widest">Carrello</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                    <ShoppingBag size={48} className="mb-4" />
                    <p className="font-bold uppercase tracking-widest text-sm">Il carrello è vuoto</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                      <div className="w-20 h-24 relative rounded-xl overflow-hidden bg-black flex-shrink-0">
                        <Image src={(item.images && item.images.length > 0) ? item.images[0] : item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-sm leading-tight text-white pr-4">{item.name}</h4>
                            <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-500">
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <span className="text-[10px] font-bold text-[#00ff80] uppercase tracking-widest">{item.category}</span>
                        </div>
                        <div className="flex items-end justify-between mt-2">
                          <div className="flex items-center bg-black rounded-lg border border-white/10 p-1">
                            <button onClick={() => updateCartQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded"><Minus size={12}/></button>
                            <span className="w-6 text-center text-xs font-bold">{item.cartQty}</span>
                            <button onClick={() => updateCartQty(item.id, 1)} disabled={item.cartQty >= item.quantity} className="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded disabled:opacity-30"><Plus size={12}/></button>
                          </div>
                          <span className="font-black text-lg">€{(item.price * item.cartQty).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-6 border-t border-white/5 bg-black">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Truck size={16} className="text-[#00ff80]" />
                      <span className="text-xs font-black uppercase tracking-widest text-gray-400">Dati di Spedizione</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input type="text" placeholder="Nome e Cognome" value={shipping.name} onChange={e => setShipping(s => ({...s, name: e.target.value}))} className="sm:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00ff80]/50 transition-colors placeholder:text-gray-600" />
                      <input type="text" placeholder="Indirizzo" value={shipping.address} onChange={e => setShipping(s => ({...s, address: e.target.value}))} className="sm:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00ff80]/50 transition-colors placeholder:text-gray-600" />
                      <input type="text" placeholder="Città" value={shipping.city} onChange={e => setShipping(s => ({...s, city: e.target.value}))} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00ff80]/50 transition-colors placeholder:text-gray-600" />
                      <input type="text" placeholder="CAP" value={shipping.zip} onChange={e => setShipping(s => ({...s, zip: e.target.value}))} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00ff80]/50 transition-colors placeholder:text-gray-600" />
                      <input type="tel" placeholder="Telefono" value={shipping.phone} onChange={e => setShipping(s => ({...s, phone: e.target.value}))} className="sm:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00ff80]/50 transition-colors placeholder:text-gray-600" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-bold uppercase tracking-widest text-gray-500">Totale</span>
                    <span className="text-3xl font-black text-white">€{cartTotal.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                    className="w-full bg-[#00ff80] text-black shadow-[0_0_20px_rgba(0,255,128,0.2)] hover:shadow-[0_0_30px_rgba(0,255,128,0.5)] font-black py-4.5 rounded-2xl transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 uppercase tracking-wider text-sm disabled:opacity-50"
                  >
                    {checkoutLoading ? "Reindirizzamento..." : "Procedi al Pagamento"}
                    {checkoutLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- PRODUCT DETAILS MODAL --- */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
            />
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/50 border border-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/10 transition-colors z-20"
              >
                <X size={18} />
              </button>

              {/* Image Gallery */}
              <div className="w-full md:w-1/2 bg-black relative flex flex-col">
                <div className="relative flex-1 min-h-[300px] md:min-h-full">
                  <Image 
                    src={(selectedProduct.images && selectedProduct.images.length > 0) ? selectedProduct.images[0] : selectedProduct.image} 
                    alt={selectedProduct.name} 
                    fill 
                    className="object-cover"
                  />
                </div>
                {/* Thumbnails if multiple images */}
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <div className="absolute bottom-6 left-6 right-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {selectedProduct.images.map((img, idx) => (
                      <div key={idx} className="w-16 h-20 relative rounded-lg overflow-hidden border-2 border-transparent hover:border-[#00ff80] cursor-pointer flex-shrink-0 bg-black">
                        <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col">
                <div className="mb-8">
                  <span className="inline-block px-3 py-1 bg-[#00ff80]/10 border border-[#00ff80]/20 text-[#00ff80] text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                    {selectedProduct.category}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-white leading-tight">
                    {selectedProduct.name}
                  </h2>
                  <div className="flex items-baseline gap-4">
                    <span className="text-4xl font-extrabold">€{selectedProduct.price.toFixed(2)}</span>
                    {selectedProduct.oldPrice && (
                      <span className="text-xl text-gray-500 line-through">€{selectedProduct.oldPrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                <div className="prose prose-invert prose-sm mb-8">
                  <p className="text-gray-400 font-medium leading-relaxed">
                    {selectedProduct.category === 'Borraccia' 
                      ? "La Borraccia Termica Intelligente in acciaio inox a doppia parete. Dotata di display LED touch per la temperatura e isolamento termico avanzato (12-24h). Design premium e materiali sicuri (BPA Free)." 
                      : "Pezzo unico selezionato accuratamente dal nostro team. Autenticità garantita al 100%. Perfetto per arricchire il tuo stile personale con un capo introvabile."}
                  </p>
                </div>

                <div className="mt-auto space-y-4">
                  <div className="flex items-center gap-2 mb-6">
                    <div className={`w-3 h-3 rounded-full ${selectedProduct.quantity > 0 ? 'bg-[#00ff80] animate-pulse' : 'bg-red-500'}`}></div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      {selectedProduct.quantity > 0 ? `${selectedProduct.quantity} Pezzi Disponibili` : 'Esaurito Definitivamente'}
                    </span>
                  </div>

                  <button 
                    onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                    disabled={selectedProduct.quantity === 0}
                    className="w-full bg-[#00ff80] text-black shadow-[0_0_20px_rgba(0,255,128,0.2)] hover:shadow-[0_0_30px_rgba(0,255,128,0.5)] font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
                  >
                    {selectedProduct.quantity === 0 ? "Non Disponibile" : "Aggiungi al Carrello"}
                    <ShoppingBag size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
