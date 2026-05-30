"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Package, CreditCard, MapPin, ChevronRight } from "lucide-react";

function SuccessInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setError(true);
      setLoading(false);
      return;
    }

    const saved = localStorage.getItem("pending_order");
    const orderData = saved ? { ...JSON.parse(saved), stripeSessionId: sessionId } : { stripeSessionId: sessionId };

    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    })
      .then((r) => r.json())
      .then((data) => {
        setOrder(data);
        localStorage.removeItem("pending_order");
        localStorage.removeItem("noctrl_cart");
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#d4c5a9] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Conferma dell'ordine in corso...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <CheckCircle size={48} className="text-[#d4c5a9] mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-2">Ordine confermato!</h1>
          <p className="text-gray-400 text-sm mb-8">Riceverai una conferma via email con i dettagli.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#d4c5a9] text-black px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-[#c0b08e] transition-colors"
          >
            Torna allo shop <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const shipping = order.shipping || {};

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 rounded-full bg-[#d4c5a9]/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-[#d4c5a9]" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Grazie per l'acquisto!</h1>
          <p className="text-gray-400 text-sm">
            Ordine #{order.id} confermato con successo.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#111] border border-white/5 rounded-2xl p-6 mb-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Package size={16} className="text-[#d4c5a9]" />
            <h2 className="text-sm font-bold uppercase tracking-wider">Prodotti</h2>
          </div>
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-300">
                  {item.name} <span className="text-gray-500">×{item.cartQty}</span>
                </span>
                <span className="font-semibold">€{(Number(item.price) * item.cartQty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 mt-4 pt-4 flex justify-between text-sm font-bold">
            <span>Totale</span>
            <span className="text-[#d4c5a9]">€{Number(order.total || 0).toFixed(2)}</span>
          </div>
        </motion.div>

        {shipping.name && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#111] border border-white/5 rounded-2xl p-6 mb-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={16} className="text-[#d4c5a9]" />
              <h2 className="text-sm font-bold uppercase tracking-wider">Spedizione</h2>
            </div>
            <p className="text-sm text-gray-300">{shipping.name}</p>
            <p className="text-sm text-gray-400">
              {shipping.address}, {shipping.city} {shipping.zip}
            </p>
            {shipping.phone && <p className="text-sm text-gray-400">{shipping.phone}</p>}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#111] border border-white/5 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={16} className="text-[#d4c5a9]" />
            <h2 className="text-sm font-bold uppercase tracking-wider">Pagamento</h2>
          </div>
          <p className="text-sm text-gray-400">Pagato con carta — riceverai una conferma via email.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#d4c5a9] text-black px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-[#c0b08e] transition-colors"
          >
            Continua lo shopping <ChevronRight size={16} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#d4c5a9] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SuccessInner />
    </Suspense>
  );
}
