"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Truck, Package, Loader2 } from "lucide-react";

import Toast from "@/components/admin/Toast";
import LoginScreen from "@/components/admin/LoginScreen";
import AdminHeader from "@/components/admin/AdminHeader";
import StatsGrid from "@/components/admin/StatsGrid";
import ProductTable from "@/components/admin/ProductTable";
import ProductForm from "@/components/admin/ProductForm";
import OrderManager from "@/components/admin/OrderManager";
import SubscriberManager from "@/components/admin/SubscriberManager";
import ConfirmDelete from "@/components/admin/ConfirmDelete";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [adminToken, setAdminToken] = useState("");

  function authHeaders(extra = {}) {
    return { ...extra, "x-admin-auth": adminToken };
  }

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const [stockUpdatingId, setStockUpdatingId] = useState(null);

  const [activeTab, setActiveTab] = useState("prodotti");
  const [subscribers, setSubscribers] = useState([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);
  const [subscribersSearch, setSubscribersSearch] = useState("");

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [editingTracking, setEditingTracking] = useState(null);
  const [trackingValue, setTrackingValue] = useState("");

  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formOldPrice, setFormOldPrice] = useState("");
  const [formCategory, setFormCategory] = useState("Outerwear");
  const [formImages, setFormImages] = useState([]);
  const [formImageUrl, setFormImageUrl] = useState("");
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [formQuantity, setFormQuantity] = useState(10);
  const [formIsNew, setFormIsNew] = useState(false);

  useEffect(() => {
    const savedAuth = localStorage.getItem("revive_admin_authenticated");
    if (savedAuth === "true") setIsAuthenticated(true);
  }, []);

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
      setOrders((await res.json()).sort((a, b) => b.id - a.id));
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
      if (!res.ok) throw new Error();
      setSubscribers(await res.json());
    } catch (err) {
      console.error("Errore fetchSubscribers:", err);
    } finally {
      setLoadingSubscribers(false);
    }
  };

  const handleDeleteSubscriber = async (subId) => {
    try {
      const res = await fetch(`/api/subscribers?id=${subId}`, { method: "DELETE", headers: authHeaders() });
      if (!res.ok) throw new Error();
      setSubscribers(prev => prev.filter(s => s.id !== subId));
      showToast("success", "Lead rimosso dal network con successo.");
    } catch {
      showToast("error", "Impossibile rimuovere il lead.");
    }
  };

  const handleExportCSV = () => {
    if (subscribers.length === 0) { showToast("warning", "Nessun lead presente da esportare."); return; }
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
    showToast("success", "Database leads esportato correttamente in CSV!");
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      showToast("success", "Stato ordine aggiornato!");
    } catch {
      showToast("error", "Errore aggiornamento stato.");
    }
  };

  const handleSaveTracking = async (orderId) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ id: orderId, tracking: trackingValue }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      setEditingTracking(null);
      showToast("success", "Tracking aggiornato!");
    } catch {
      showToast("error", "Errore salvataggio tracking.");
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error();
      setProducts((await res.json()).sort((a, b) => b.id - a.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        setAdminToken(password);
        if (rememberMe) localStorage.setItem("revive_admin_authenticated", "true");
      } else {
        setAuthError("Codice di accesso non valido. Riprova.");
        setPassword("");
      }
    } catch {
      setAuthError("Errore di connessione. Riprova.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("revive_admin_authenticated");
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormName(""); setFormPrice(""); setFormOldPrice("");
    setFormCategory("Outerwear"); setFormImages([]); setFormImageUrl("");
    setFormQuantity(10); setFormIsNew(true);
    setIsModalOpen(true);
  };

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

  const handleAdjustStock = async (product, amount) => {
    const newQty = Math.max(0, product.quantity + amount);
    if (newQty === product.quantity) return;
    setStockUpdatingId(product.id);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ quantity: newQty }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setProducts(prev => prev.map(p => p.id === product.id ? updated : p));
    } catch {
      showToast("error", "Impossibile aggiornare la quantità in magazzino.");
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
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.urls) setFormImages(prev => [...prev, ...data.urls]);
    } catch (err) {
      showToast("error", "Impossibile caricare le immagini: " + err.message);
    } finally {
      setUploadingFiles(false);
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
    setFormImages(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formName || !formPrice || formImages.length === 0) {
      showToast("warning", "Compila tutti i campi obbligatori (Nome, Prezzo) e aggiungi almeno un'immagine");
      return;
    }
    setSubmitting(true);
    const payload = {
      name: formName, price: parseFloat(formPrice),
      oldPrice: formOldPrice ? parseFloat(formOldPrice) : null,
      category: formCategory, images: formImages,
      quantity: parseInt(formQuantity), isNew: formIsNew,
    };
    try {
      let res;
      if (editingProduct) {
        res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT", headers: authHeaders({ "Content-Type": "application/json" }), body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/products", {
          method: "POST", headers: authHeaders({ "Content-Type": "application/json" }), body: JSON.stringify(payload),
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
      showToast("error", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${deletingProduct.id}`, { method: "DELETE", headers: authHeaders() });
      if (!res.ok) throw new Error();
      setProducts(prev => prev.filter(p => p.id !== deletingProduct.id));
      showSuccessMessage("Prodotto eliminato correttamente.");
      setDeletingProduct(null);
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  const stats = {
    totalProducts: products.length,
    totalStock: products.reduce((acc, p) => acc + p.quantity, 0),
    outOfStock: products.filter(p => p.quantity === 0).length,
    lowStock: products.filter(p => p.quantity > 0 && p.quantity <= 3).length,
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#00ff80] selection:text-black overflow-x-hidden relative">
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00ff80]/5 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00ff80]/3 blur-[120px] rounded-full pointer-events-none z-0" />

      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <LoginScreen
            key="login"
            password={password}
            onPasswordChange={setPassword}
            authError={authError}
            rememberMe={rememberMe}
            onRememberMeChange={setRememberMe}
            onLogin={handleLogin}
          />
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-6 py-12 relative z-10"
          >
            <Toast toast={toast} onClose={() => setToast(null)} />

            <AdminHeader onLogout={handleLogout} stats={stats} />

            <StatsGrid stats={stats} loading={loading} />

            <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
              {[
                { key: "prodotti", label: "Catalogo Prodotti", count: stats.totalProducts },
                { key: "leads", label: "Network Leads", count: subscribers.length },
                { key: "ordini", label: "Ordini", count: orders.length },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === tab.key
                      ? "bg-[#00ff80] text-black shadow-[0_0_20px_rgba(0,255,128,0.3)]"
                      : "bg-white/5 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {activeTab === "prodotti" && (
              <ProductTable
                products={products}
                loading={loading}
                error={error}
                onRefresh={fetchProducts}
                onOpenAddModal={handleOpenAddModal}
                onOpenEditModal={handleOpenEditModal}
                onDeleteClick={setDeletingProduct}
                onAdjustStock={handleAdjustStock}
                stockUpdatingId={stockUpdatingId}
              />
            )}

            {activeTab === "leads" && (
              <SubscriberManager
                subscribers={subscribers}
                loading={loadingSubscribers}
                searchQuery={subscribersSearch}
                onSearchChange={setSubscribersSearch}
                onDelete={handleDeleteSubscriber}
                onExport={handleExportCSV}
              />
            )}

            {activeTab === "ordini" && (
              <OrderManager
                orders={orders}
                loading={loadingOrders}
                editingTracking={editingTracking}
                trackingValue={trackingValue}
                onTrackingEdit={(id) => { setEditingTracking(id); setTrackingValue(orders.find(o => o.id === id)?.tracking || ""); }}
                onTrackingChange={setTrackingValue}
                onTrackingSave={handleSaveTracking}
                onTrackingCancel={() => setEditingTracking(null)}
                onUpdateStatus={handleUpdateOrderStatus}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ProductForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingProduct={editingProduct}
        formName={formName}
        onFormNameChange={setFormName}
        formPrice={formPrice}
        onFormPriceChange={setFormPrice}
        formOldPrice={formOldPrice}
        onFormOldPriceChange={setFormOldPrice}
        formCategory={formCategory}
        onFormCategoryChange={setFormCategory}
        formQuantity={formQuantity}
        onFormQuantityChange={setFormQuantity}
        formIsNew={formIsNew}
        onFormIsNewChange={setFormIsNew}
        formImages={formImages}
        onFormImagesChange={setFormImages}
        formImageUrl={formImageUrl}
        onFormImageUrlChange={setFormImageUrl}
        uploadingFiles={uploadingFiles}
        onFileUpload={handleFileUpload}
        onAddImageUrl={handleAddImageUrl}
        onRemoveImage={handleRemoveImage}
        onSubmit={handleSubmit}
        submitting={submitting}
      />

      <ConfirmDelete
        product={deletingProduct}
        submitting={submitting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingProduct(null)}
      />
    </div>
  );
}
