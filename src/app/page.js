"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CountdownTimer from "@/components/CountdownTimer";
import ProductGrid from "@/components/ProductGrid";
import LifestyleSection from "@/components/LifestyleSection";
import TrendingFits from "@/components/TrendingFits";
import SocialProof from "@/components/SocialProof";
import StorySection from "@/components/StorySection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductModal from "@/components/ProductModal";
import NewsletterPopup from "@/components/NewsletterPopup";

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
  const [checkoutError, setCheckoutError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [shipping, setShipping] = useState({
    name: "", address: "", city: "", zip: "", phone: "",
  });

  const [countdown, setCountdown] = useState({ d: "00", h: "00", m: "00", s: "00" });

  const carouselRef = useRef(null);
  const heroRef = useRef(null);

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      const sessionId = params.get("session_id") || "";
      const saved = localStorage.getItem("pending_order");
      if (saved) {
        const orderData = JSON.parse(saved);
        orderData.stripeSessionId = sessionId;
        fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        }).then(() => {
          localStorage.removeItem("pending_order");
          setCartItems([]);
          if (typeof fbq !== "undefined") {
            fbq("track", "Purchase", {
              value: orderData.total || 0,
              currency: "EUR",
            });
          }
        }).finally(() => {
          window.location.href = `/success?session_id=${sessionId}`;
        });
      } else {
        window.location.href = `/success?session_id=${sessionId}`;
      }
    }
  }, []);

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

  const closePopup = useCallback(() => {
    setShowPopup(false);
    sessionStorage.setItem("newsletter_popup_dismissed", "true");
  }, []);

  const handleSubscribe = useCallback(async (e) => {
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
        setSubmitError(data.error || "Errore durante l'iscrizione.");
      }
    } catch {
      setSubmitError("Errore di connessione. Controlla la tua rete.");
    } finally {
      setSubmitting(false);
    }
  }, [email]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isSearchOpen) return;
    const handleClick = (e) => {
      if (!e.target.closest(".search-container")) setIsSearchOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isSearchOpen]);

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

  const addToCart = useCallback((product) => {
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
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const updateCartQty = useCallback((productId, amount) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const newQty = Math.max(1, Math.min(item.cartQty + amount, item.quantity));
          return { ...item, cartQty: newQty };
        }
        return item;
      })
    );
  }, []);

  const cartTotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.cartQty, 0),
    [cartItems]
  );
  const cartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.cartQty, 0),
    [cartItems]
  );

  const handleCheckout = useCallback(async () => {
    if (!shipping.name || !shipping.address || !shipping.city || !shipping.zip || !shipping.phone) {
      setCheckoutError("Compila tutti i campi di spedizione.");
      return;
    }
    setCheckoutError("");
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
        setCheckoutError(data.error || "Riprova più tardi.");
      }
    } catch {
      setCheckoutError("Errore di connessione. Riprova.");
    } finally {
      setCheckoutLoading(false);
    }
  }, [cartItems, shipping, cartTotal]);

  const categories = useMemo(
    () => ["All", ...new Set(products.map((p) => p.category))],
    [products]
  );

  const filteredProducts = useMemo(
    () =>
      products
        .filter((p) => filterCategory === "All" || p.category === filterCategory)
        .sort((a, b) => {
          if (sortOrder === "Price Low") return a.price - b.price;
          if (sortOrder === "Price High") return b.price - a.price;
          return b.id - a.id;
        }),
    [products, filterCategory, sortOrder]
  );

  const searchResults = useMemo(
    () =>
      searchQuery.trim() === ""
        ? []
        : products.filter(
            (p) =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.category.toLowerCase().includes(searchQuery.toLowerCase())
          ),
    [products, searchQuery]
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-[family-name:var(--font-body)] selection:bg-[#d4c5a9] selection:text-[#0a0a0a] overflow-x-hidden relative">
      <AnimatePresence>
        {orderSuccess && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] bg-[#d4c5a9] text-black font-bold px-8 py-4 rounded-2xl shadow-[0_0_40px_rgba(212,197,169,0.3)] flex items-center gap-3 text-sm"
          >
            <CheckCircle2 size={22} />
            Ordine confermato! Riceverai aggiornamenti via email.
            <button onClick={() => setOrderSuccess(false)} className="ml-2 p-1 hover:bg-black/10 rounded-full">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Header
        scrolled={scrolled}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={searchResults}
        setSelectedProduct={setSelectedProduct}
        cartCount={cartCount}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
      />

      <Hero heroRef={heroRef} />

      <CountdownTimer countdown={countdown} />

      <ProductGrid
        products={products}
        loading={loading}
        filteredProducts={filteredProducts}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        categories={categories}
        onSelectProduct={setSelectedProduct}
        onAddToCart={addToCart}
      />

      <LifestyleSection />

      <TrendingFits carouselRef={carouselRef} />

      <SocialProof />

      <StorySection />

      <NewsletterSection />

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        cartTotal={cartTotal}
        cartCount={cartCount}
        onRemove={removeFromCart}
        onUpdateQty={updateCartQty}
        shipping={shipping}
        onShippingChange={setShipping}
        onCheckout={handleCheckout}
        checkoutLoading={checkoutLoading}
        checkoutError={checkoutError}
        onClearError={() => setCheckoutError("")}
      />

      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={addToCart}
          />
        )}
      </AnimatePresence>

      <NewsletterPopup
        showPopup={showPopup}
        onClose={closePopup}
        email={email}
        onEmailChange={setEmail}
        onSubmit={handleSubscribe}
        submitting={submitting}
        submitSuccess={submitSuccess}
        submitError={submitError}
      />
    </div>
  );
}
