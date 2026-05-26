"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag, ArrowRight, CheckCircle2, Search, User,
  Loader2, AlertTriangle, X, Minus, Plus, Trash2, Truck,
  Heart, Instagram, Clock, ChevronLeft, ChevronRight, Play
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const REVIEWS = [
  {
    name: "Jake M.",
    handle: "@jakemartin",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    text: "The quality is insane. Got the oversized tee and it's already my go-to. Fit is perfect.",
    stars: 5,
  },
  {
    name: "Sophia K.",
    handle: "@sophiak",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    text: "NOCTRL is different. You can feel the quality the moment you unbox. Already copping the next drop.",
    stars: 5,
  },
  {
    name: "Marcus T.",
    handle: "@marcust",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    text: "Best purchase this year. The cargo fit is unmatched. Shipping was fast too.",
    stars: 5,
  },
];

const LIFESTYLE_ITEMS = [
  {
    img: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=900&q=80",
    label: "Night City",
    tag: "After Dark",
    text: "The city never sleeps. Neither does the style.",
    tall: true,
  },
  {
    img: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
    label: "Urban Canvas",
    tag: "Concrete",
    text: "",
    tall: false,
  },
  {
    img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80",
    label: "Editorial",
    tag: "Underground",
    text: "Raw. Real. Unfiltered. This is NOCTRL.",
    tall: false,
    wide: true,
  },
];

const TRENDING_FITS = [
  {
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
    title: "Oversized Street Set",
    items: "Essential Tee × Urban Cargo × Sneakers",
  },
  {
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    title: "Dark Layering",
    items: "Hoodie × Cargo Joggers × Beanie",
  },
  {
    img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
    title: "Monochrome Minimal",
    items: "Oversized Tee × Relaxed Pants × Cap",
  },
  {
    img: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80",
    title: "Summer Street Set",
    items: "Tee × Shorts × Accessories",
  },
  {
    img: "https://images.unsplash.com/photo-1544441893-675973e36785?w=600&q=80",
    title: "90s Revival",
    items: "Oversized Tee × Baggy Denim × Retro",
  },
];

const COMMUNITY_GRID = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
  "https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=400&q=80",
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80",
  "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
];

export default function NOCTRL() {
  const [scrolled, setScrolled] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [filterCategory, setFilterCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("Latest");

  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [shipping, setShipping] = useState({
    name: "", address: "", city: "", zip: "", phone: "",
  });

  const [countdown, setCountdown] = useState({ d: "00", h: "00", m: "00", s: "00" });

  const carouselRef = useRef(null);
  const heroRef = useRef(null);

  // Countdown timer
  useEffect(() => {
    const target = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setCountdown({
        d: String(Math.floor(diff / 86400000)).padStart(2, "0"),
        h: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0"),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, "0"),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Order success
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      const saved = localStorage.getItem("pending_order");
      if (saved) {
        const orderData = JSON.parse(saved);
        fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: saved,
        }).then(() => {
          localStorage.removeItem("pending_order");
          setOrderSuccess(true);
          setCartItems([]);
          if (typeof fbq !== "undefined") {
            fbq("track", "Purchase", {
              value: orderData.total || 0,
              currency: "EUR",
            });
          }
          window.history.replaceState({}, "", "/");
        }).catch(() => {});
      } else {
        setOrderSuccess(true);
        window.history.replaceState({}, "", "/");
      }
    }
  }, []);

  // Newsletter popup
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
      if (e.clientY < 20) setShowPopup(true);
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  const closePopup = () => {
    setShowPopup(false);
    sessionStorage.setItem("newsletter_popup_dismissed", "true");
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.trim()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitSuccess(true);
        localStorage.setItem("newsletter_subscribed", "true");
        setShowPopup(false);
        setEmail("");
      } else {
        setSubmitError(data.error || "Something went wrong.");
      }
    } catch {
      setSubmitError("Network error. Check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Search close
  useEffect(() => {
    if (!isSearchOpen) return;
    const handleClick = (e) => {
      if (!e.target.closest(".search-container")) setIsSearchOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isSearchOpen]);

  // Load products
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          setProducts(await res.json());
        }
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Cart
  const addToCart = (product) => {
    if (product.quantity === 0) return;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
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
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateCartQty = (productId, amount) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const newQty = Math.max(1, Math.min(item.cartQty + amount, item.quantity));
          return { ...item, cartQty: newQty };
        }
        return item;
      })
    );
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.cartQty, 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.cartQty, 0);

  // Checkout
  const handleCheckout = async () => {
    if (!shipping.name || !shipping.address || !shipping.city || !shipping.zip || !shipping.phone) {
      alert("Please fill in all shipping fields.");
      return;
    }
    setCheckoutLoading(true);
    const orderData = { items: cartItems, shipping, total: cartTotal };
    localStorage.setItem("pending_order", JSON.stringify(orderData));
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Error: " + (data.error || "Try again later."));
      }
    } catch {
      alert("Connection error. Try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Filter & Sort
  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const filteredProducts = products
    .filter((p) => {
      if (filterCategory === "All") return true;
      return p.category === filterCategory;
    })
    .sort((a, b) => {
      if (sortOrder === "Price Low") return a.price - b.price;
      if (sortOrder === "Price High") return b.price - a.price;
      return b.id - a.id;
    });

  // Search
  const searchResults =
    searchQuery.trim() === ""
      ? []
      : products.filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-[family-name:var(--font-body)] selection:bg-[#d4c5a9] selection:text-[#0a0a0a] overflow-x-hidden relative">
      {/* Order success banner */}
      <AnimatePresence>
        {orderSuccess && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] bg-[#d4c5a9] text-black font-bold px-8 py-4 rounded-2xl shadow-[0_0_40px_rgba(212,197,169,0.3)] flex items-center gap-3 text-sm"
          >
            <CheckCircle2 size={22} />
            Order confirmed! You'll receive shipping updates via email.
            <button onClick={() => setOrderSuccess(false)} className="ml-2 p-1 hover:bg-black/10 rounded-full">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== HEADER ===== */}
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
            <a href="#drop" className="hover:text-white transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[#d4c5a9] after:transition-all hover:after:w-full">
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
              {isSearchOpen && (
                <div className="absolute right-0 top-full mt-3 w-80 bg-[#111] border border-white/5 rounded-2xl shadow-2xl overflow-hidden z-50">
                  <div className="p-4 border-b border-white/5">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#d4c5a9]/50 transition-colors placeholder:text-gray-600"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {searchQuery.trim() === "" ? (
                      <div className="p-6 text-center text-gray-500 text-sm">Type to search...</div>
                    ) : searchResults.length === 0 ? (
                      <div className="p-6 text-center text-gray-500 text-sm">No results found.</div>
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
                </div>
              )}
            </div>

            <button onClick={() => setIsCartOpen(true)} className="text-gray-400 hover:text-white transition-colors relative">
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#d4c5a9] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <Link href="/admin" className="hidden sm:block text-gray-400 hover:text-[#d4c5a9] transition-colors">
              <User size={18} />
            </Link>
          </div>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section ref={heroRef} className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1920&q=80"
            alt="NOCTRL Streetwear"
            fill
            className="object-cover object-center brightness-[0.35] saturate-[1.1]"
            priority
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/20 via-[#050505]/60 to-[#050505]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full mt-16">
          <div className="max-w-3xl">
            <div className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#d4c5a9] mb-6 animate-fade-up">
              New Season — Drop 001
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-[clamp(5rem,15vw,10rem)] leading-[0.9] tracking-[-0.03em] text-white animate-fade-up">
              <span className="block">NOCTRL</span>
              <span className="block">Streetwear</span>
              <span className="block">Essentials</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-lg mt-6 mb-10 leading-relaxed animate-fade-up">
              Minimal urban clothing built for everyday expression.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-up">
              <a
                href="#products"
                className="inline-flex items-center gap-2 bg-white text-[#0a0a0a] px-9 py-4 rounded text-[0.7rem] font-bold tracking-[0.12em] uppercase transition-all hover:bg-[#d4c5a9] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(212,197,169,0.2)]"
              >
                SHOP NOW
              </a>
              <a
                href="#drop"
                className="inline-flex items-center gap-2 border border-gray-600 text-white px-9 py-4 rounded text-[0.7rem] font-bold tracking-[0.12em] uppercase transition-all hover:border-white hover:bg-white/5 hover:-translate-y-0.5"
              >
                NEW DROP
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-fade-up">
          <span className="text-[0.55rem] font-semibold tracking-[0.15em] uppercase text-gray-600">Scroll</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-gray-600 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ===== COUNTDOWN SECTION ===== */}
      <section className="py-20 bg-[#0a0a0a] text-center border-y border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-[#d4c5a9] mb-4">
            Next Drop In
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(2rem,5vw,3rem)] text-white mb-10">
            DROP 002 — Limited Edition
          </h2>
          <div className="flex justify-center gap-4 sm:gap-8">
            {[
              { label: "Days", value: countdown.d },
              { label: "Hours", value: countdown.h },
              { label: "Mins", value: countdown.m },
              { label: "Secs", value: countdown.s },
            ].map((unit, i) => (
              <div key={unit.label} className="flex items-center gap-4 sm:gap-8">
                <div className="flex flex-col items-center">
                  <div className="font-[family-name:var(--font-display)] text-[clamp(2.5rem,6vw,4rem)] text-white leading-none bg-[#111] px-5 py-4 sm:px-7 sm:py-5 rounded-xl border border-white/[0.04] min-w-[70px] sm:min-w-[90px]">
                    {unit.value}
                  </div>
                  <span className="text-[0.55rem] font-semibold tracking-[0.1em] uppercase text-gray-500 mt-2">
                    {unit.label}
                  </span>
                </div>
                {i < 3 && (
                  <span className="font-[family-name:var(--font-display)] text-[clamp(2rem,5vw,3rem)] text-[#d4c5a9] leading-none pt-4 hidden sm:block">
                    :
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED DROP SECTION ===== */}
      <section id="drop" className="py-28">
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

              {/* PRODUCTS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product, index) => {
                  const mainImage =
                    product.images && product.images.length > 0
                      ? product.images[0]
                      : product.image;
                  const hoverImage =
                    product.images && product.images.length > 1
                      ? product.images[1]
                      : mainImage;

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ delay: (index % 4) * 0.08, duration: 0.5 }}
                      className="product-card group cursor-pointer"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-[#111]">
                        <Image
                          src={mainImage}
                          alt={product.name}
                          fill
                          className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                        />
                        <Image
                          src={hoverImage}
                          alt={product.name + " detail"}
                          fill
                          className="object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100 scale-105 group-hover:scale-100"
                        />

                        {/* Badges */}
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

                        {/* Quick add */}
                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
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

                        {/* Wishlist button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-white transition-colors z-10"
                        >
                          <Heart size={14} />
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
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ===== LIFESTYLE SECTION ===== */}
      <section id="lifestyle" className="py-28 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <span className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-[#d4c5a9] block mb-4">
              Lifestyle
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(3rem,8vw,7rem)] leading-[0.95] text-white">
              Wear the <span className="text-[#d4c5a9]">Concrete</span>
            </h2>
            <p className="text-gray-400 max-w-lg mt-4 leading-relaxed">
              From the streets to the spotlight. NOCTRL is worn by those who move different.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px] md:auto-rows-[400px]">
            {LIFESTYLE_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl overflow-hidden group cursor-pointer ${
                  item.tall ? "md:row-span-2" : ""
                } ${item.wide ? "md:col-span-2" : ""}`}
              >
                <Image
                  src={item.img}
                  alt={item.tag}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-[1]" />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-[2]">
                  <div className="text-[0.55rem] font-semibold tracking-[0.15em] uppercase text-[#d4c5a9] mb-3">
                    {item.label}
                  </div>
                  <div className="font-[family-name:var(--font-display)] text-4xl text-white leading-none mb-2">
                    {item.tag}
                  </div>
                  {item.text && (
                    <p className="text-sm text-gray-300 max-w-md leading-relaxed">{item.text}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRENDING FITS (Carousel) ===== */}
      <section className="py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <span className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-[#d4c5a9] block mb-4">
            Trending Fits
          </span>
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(3rem,8vw,7rem)] leading-[0.95] text-white">
            #NOCTRL <span className="text-[#d4c5a9]">Fits</span>
          </h2>
        </div>

        <div className="relative">
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto px-6 no-scrollbar scroll-smooth pb-4"
          >
            {TRENDING_FITS.map((fit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex-shrink-0 w-[280px] sm:w-[320px] bg-[#0a0a0a] rounded-2xl overflow-hidden group cursor-pointer border border-white/[0.04]"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={fit.img}
                    alt={fit.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center transition-transform group-hover:scale-110">
                      <Play size={20} className="text-white ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-semibold text-white">{fit.title}</h3>
                  <p className="text-[0.65rem] text-gray-500 mt-1">{fit.items}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Carousel arrows */}
          <button
            onClick={() => {
              if (carouselRef.current) carouselRef.current.scrollBy({ left: -340, behavior: "smooth" });
            }}
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 items-center justify-center text-gray-400 hover:text-white transition-colors z-10"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => {
              if (carouselRef.current) carouselRef.current.scrollBy({ left: 340, behavior: "smooth" });
            }}
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 items-center justify-center text-gray-400 hover:text-white transition-colors z-10"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* ===== SOCIAL PROOF ===== */}
      <section className="py-28 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <span className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-[#d4c5a9] block mb-4">
              Social Proof
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(3rem,8vw,7rem)] leading-[0.95] text-white">
              Worn by the <span className="text-[#d4c5a9]">Community</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {REVIEWS.map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#111] border border-white/[0.04] rounded-2xl p-7 hover:border-white/[0.08] transition-all hover:-translate-y-0.5"
              >
                <div className="text-[#d4c5a9] text-sm tracking-wider mb-3">
                  {"★".repeat(review.stars)}
                </div>
                <p className="text-sm text-gray-200 leading-relaxed mb-5">&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-700 overflow-hidden relative">
                    <Image src={review.avatar} alt={review.name} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{review.name}</div>
                    <div className="text-[0.6rem] text-gray-500">{review.handle}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Community grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-12">
            {COMMUNITY_GRID.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
              >
                <Image src={img} alt={`Community ${i}`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Instagram size={24} className="text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STORYTELLING SECTION ===== */}
      <section id="story" className="py-28 relative overflow-hidden">
        <div className="absolute top-[-50%] right-[-30%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(212,197,169,0.03)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <span className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-[#d4c5a9] block mb-4">
              Our Story
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(3.5rem,10vw,8rem)] leading-[0.95] text-white mb-8">
              Built for people<br />
              who move <span className="text-[#d4c5a9]">different.</span>
            </h2>
            <p className="text-base text-gray-400 max-w-xl leading-relaxed mb-10">
              NOCTRL was born from the raw edges of the city. Where concrete meets creativity and
              every street tells a story. We don&apos;t follow trends — we set our own pace. Minimal
              silhouettes, premium fabrics, and uncompromising attention to detail.
              <br />
              <br />
              This isn&apos;t just clothing. It&apos;s a mindset. A statement. A lifestyle for those
              who move different.
            </p>
            <a
              href="#products"
              className="inline-flex items-center gap-2 bg-[#d4c5a9] text-[#0a0a0a] px-9 py-4 rounded text-[0.7rem] font-bold tracking-[0.12em] uppercase transition-all hover:bg-[#e8dcc8] hover:-translate-y-0.5"
            >
              Join the Movement
              <ArrowRight size={16} />
            </a>

            <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-white/[0.04]">
              {[
                { num: "10K+", label: "Community Members" },
                { num: "24h", label: "Shipping" },
                { num: "100%", label: "Authentic Quality" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="font-[family-name:var(--font-display)] text-4xl text-white leading-none mb-1">
                    {stat.num}
                  </div>
                  <div className="text-[0.6rem] text-gray-500 uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER SECTION ===== */}
      <section className="py-28 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-xl mx-auto text-center">
            <span className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-[#d4c5a9] block mb-4">
              Stay Connected
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(2.5rem,6vw,4rem)] text-white mb-4 leading-none">
              Join the <span className="text-[#d4c5a9]">NOCTRL</span> Community
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-8">
              Be the first to know about new drops, exclusive releases, and community events.{' '}
              <strong className="text-white">10% off your first order.</strong>
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.target.querySelector("input");
                if (input?.value) {
                  fetch("/api/subscribe", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: input.value }),
                  });
                  input.value = "";
                  alert("Welcome to the NOCTRL community!");
                }
              }}
              className="flex gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="flex-1 bg-[#111] border border-white/10 rounded-lg px-5 py-4 text-sm outline-none focus:border-[#d4c5a9]/50 transition-colors placeholder:text-gray-600"
              />
              <button
                type="submit"
                className="bg-[#d4c5a9] text-[#0a0a0a] px-7 py-4 rounded-lg text-[0.65rem] font-bold uppercase tracking-widest transition-all hover:bg-[#e8dcc8] flex-shrink-0"
              >
                Subscribe
              </button>
            </form>
            <p className="text-[0.6rem] text-gray-600 mt-4">
              By subscribing you agree to our Privacy Policy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-20 bg-[#050505] border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <Link href="/" className="text-3xl font-[family-name:var(--font-display)] tracking-[0.05em] text-white leading-none block mb-4">
                NOCTRL
              </Link>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                Minimal streetwear essentials. Built for those who move different. Premium urban
                clothing for everyday expression.
              </p>
              <div className="flex gap-3 mt-6">
                {[Instagram, Clock].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-full border border-white/[0.06] flex items-center justify-center text-gray-400 hover:border-[#d4c5a9] hover:bg-[#d4c5a9]/5 transition-all"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {[
              {
                title: "Quick Links",
                links: ["Shop All", "New Drop", "Trending", "Our Story"],
              },
              {
                title: "Support",
                links: ["Size Guide", "Shipping Info", "Returns", "Contact"],
              },
              {
                title: "Legal",
                links: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-white mb-6">
                  {col.title}
                </h4>
                <ul className="space-y-3.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-white/[0.04]">
            <p className="text-[0.65rem] text-gray-600">
              &copy; 2026 NOCTRL. All rights reserved.
            </p>
            <div className="flex gap-3">
              <svg viewBox="0 0 36 24" className="w-9 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="3" width="34" height="18" rx="3" />
                <path d="M12 12h12M15 9l-3 3 3 3M21 9l3 3-3 3" />
              </svg>
              <svg viewBox="0 0 36 24" className="w-9 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="3" width="34" height="18" rx="3" />
                <circle cx="14" cy="12" r="4" />
                <circle cx="22" cy="12" r="4" />
              </svg>
              <svg viewBox="0 0 36 24" className="w-9 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="3" width="34" height="18" rx="3" />
                <circle cx="12" cy="12" r="3" />
                <circle cx="24" cy="12" r="3" />
              </svg>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/admin" className="text-[0.55rem] text-gray-700 hover:text-gray-500 uppercase tracking-widest transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </footer>

      {/* ===== CART DRAWER ===== */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
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
                  onClick={() => setIsCartOpen(false)}
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
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-semibold text-white pr-3 truncate">{item.name}</h4>
                            <button
                              onClick={() => removeFromCart(item.id)}
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
                              onClick={() => updateCartQty(item.id, -1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-7 text-center text-xs font-bold text-white">{item.cartQty}</span>
                            <button
                              onClick={() => updateCartQty(item.id, 1)}
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
                        Shipping Details
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={shipping.name}
                        onChange={(e) => setShipping((s) => ({ ...s, name: e.target.value }))}
                        className="sm:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#d4c5a9]/50 transition-colors placeholder:text-gray-600"
                      />
                      <input
                        type="text"
                        placeholder="Address"
                        value={shipping.address}
                        onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))}
                        className="sm:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#d4c5a9]/50 transition-colors placeholder:text-gray-600"
                      />
                      <input
                        type="text"
                        placeholder="City"
                        value={shipping.city}
                        onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#d4c5a9]/50 transition-colors placeholder:text-gray-600"
                      />
                      <input
                        type="text"
                        placeholder="ZIP"
                        value={shipping.zip}
                        onChange={(e) => setShipping((s) => ({ ...s, zip: e.target.value }))}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#d4c5a9]/50 transition-colors placeholder:text-gray-600"
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={shipping.phone}
                        onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))}
                        className="sm:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#d4c5a9]/50 transition-colors placeholder:text-gray-600"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-5">
                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">Total</span>
                    <span className="font-[family-name:var(--font-display)] text-2xl text-white">
                      €{cartTotal.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                    className="w-full bg-white text-[#0a0a0a] font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-[#d4c5a9] hover:-translate-y-0.5 uppercase tracking-wider text-xs disabled:opacity-50"
                  >
                    {checkoutLoading ? (
                      <>
                        Redirecting... <Loader2 size={16} className="animate-spin" />
                      </>
                    ) : (
                      <>
                        Proceed to Checkout <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===== PRODUCT DETAIL MODAL ===== */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="w-full max-w-5xl bg-[#111] border border-white/[0.06] rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-5 right-5 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors z-20"
              >
                <X size={16} />
              </button>

              {/* Image */}
              <div className="w-full md:w-1/2 bg-black relative min-h-[300px] md:min-h-[500px]">
                <Image
                  src={
                    selectedProduct.images && selectedProduct.images.length > 0
                      ? selectedProduct.images[0]
                      : selectedProduct.image
                  }
                  alt={selectedProduct.name}
                  fill
                  className="object-cover"
                />
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <div className="absolute bottom-5 left-5 right-5 flex gap-2 overflow-x-auto no-scrollbar">
                    {selectedProduct.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="w-14 h-18 relative rounded-lg overflow-hidden border-2 border-transparent hover:border-[#d4c5a9] cursor-pointer flex-shrink-0 bg-black transition-colors"
                      >
                        <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="w-full md:w-1/2 p-8 md:p-10 overflow-y-auto flex flex-col">
                <div className="mb-6">
                  <span className="inline-block text-[0.5rem] font-bold text-[#d4c5a9] uppercase tracking-widest mb-3">
                    {selectedProduct.category}
                  </span>
                  <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-white leading-tight mb-3">
                    {selectedProduct.name}
                  </h2>
                  <div className="flex items-baseline gap-3">
                    <span className="font-[family-name:var(--font-display)] text-3xl text-white">
                      €{selectedProduct.price.toFixed(2)}
                    </span>
                    {selectedProduct.oldPrice && (
                      <span className="text-lg text-gray-600 line-through">
                        €{selectedProduct.oldPrice.toFixed(2)}
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
                        selectedProduct.quantity > 0 ? "bg-[#d4c5a9]" : "bg-red-500"
                      }`}
                    />
                    <span className="text-[0.55rem] font-semibold uppercase tracking-widest text-gray-400">
                      {selectedProduct.quantity > 0
                        ? `${selectedProduct.quantity} units available`
                        : "Sold Out"}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    disabled={selectedProduct.quantity === 0}
                    className="w-full bg-white text-[#0a0a0a] font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 hover:bg-[#d4c5a9] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xs"
                  >
                    {selectedProduct.quantity === 0 ? "Sold Out" : "Add to Cart"}
                    <ShoppingBag size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===== NEWSLETTER POPUP ===== */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePopup}
              className="absolute inset-0 bg-black/85 backdrop-blur-xl cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="w-full max-w-lg bg-[#111] border border-white/[0.06] rounded-3xl p-10 sm:p-14 text-center relative z-10"
            >
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <X size={16} />
              </button>

              <div className="w-16 h-16 rounded-full bg-[#d4c5a9]/10 border border-[#d4c5a9]/20 flex items-center justify-center mx-auto mb-6">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#d4c5a9]" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                  <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
                </svg>
              </div>

              <h3 className="font-[family-name:var(--font-display)] text-3xl text-white mb-3 leading-none">
                Join the Community
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Subscribe for early access to drops, exclusive releases, and{' '}
                <strong className="text-white">10% off your first order.</strong>
              </p>

              {submitSuccess ? (
                <div className="text-[#d4c5a9] font-semibold text-sm">
                  You&apos;re in. Welcome to NOCTRL.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm text-center outline-none focus:border-[#d4c5a9]/50 transition-colors placeholder:text-gray-600"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#d4c5a9] text-[#0a0a0a] font-bold py-4 rounded-xl transition-all hover:bg-[#e8dcc8] disabled:opacity-50 uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Subscribing...
                      </>
                    ) : (
                      "Get 10% Off"
                    )}
                  </button>
                  {submitError && <p className="text-red-500 text-xs">{submitError}</p>}
                </form>
              )}

              <p className="text-[0.55rem] text-gray-600 mt-4">No spam. Unsubscribe anytime.</p>
              <button onClick={closePopup} className="text-[0.6rem] text-gray-500 underline hover:text-gray-300 mt-4 transition-colors">
                No thanks, I&apos;ll take my chances
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
