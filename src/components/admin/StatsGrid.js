"use client";

import { Package, Layers, AlertTriangle } from "lucide-react";

export default function StatsGrid({ stats, loading }) {
  const cards = [
    {
      label: "Totale Prodotti",
      value: stats?.totalProducts ?? 0,
      sub: "Modelli in catalogo",
      icon: Package,
      iconColor: "text-[#00ff80]",
      iconBg: "bg-[#00ff80]/5",
    },
    {
      label: "Disponibilità Totale",
      value: stats?.totalStock ?? 0,
      sub: "Pezzi totali in magazzino",
      icon: Layers,
      iconColor: "text-[#00ff80]",
      iconBg: "bg-[#00ff80]/5",
    },
    {
      label: "Esauriti",
      value: stats?.outOfStock ?? 0,
      sub: "Prodotti fuori stock",
      icon: AlertTriangle,
      iconColor: "text-red-500",
      iconBg: "bg-red-500/5",
      valueColor: (stats?.outOfStock ?? 0) > 0 ? "text-red-500" : "",
    },
    {
      label: "Scorte Basse",
      value: stats?.lowStock ?? 0,
      sub: "Meno di 3 pezzi rimasti",
      icon: AlertTriangle,
      iconColor: "text-yellow-500",
      iconBg: "bg-yellow-500/5",
      valueColor: (stats?.lowStock ?? 0) > 0 ? "text-yellow-500" : "",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="p-6 md:p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 flex flex-col justify-between hover:border-white/10 transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{card.label}</span>
            <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center ${card.iconColor}`}>
              <card.icon size={16} />
            </div>
          </div>
          <div>
            <h3 className={`text-3xl md:text-4xl font-extrabold ${card.valueColor || ""}`}>
              {loading ? "..." : card.value}
            </h3>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider mt-1">{card.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
