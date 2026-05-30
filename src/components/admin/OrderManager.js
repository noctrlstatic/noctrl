"use client";

import { Loader2, Truck } from "lucide-react";

export default function OrderManager({
  orders, loading, editingTracking, trackingValue,
  onTrackingEdit, onTrackingChange, onTrackingSave, onTrackingCancel,
  onUpdateStatus
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem]">
        <Loader2 size={40} className="text-[#00ff80] animate-spin mb-4" />
        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Caricamento ordini...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-24 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem]">
        <Truck size={40} className="text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 font-bold uppercase tracking-widest">Nessun ordine ancora ricevuto.</p>
      </div>
    );
  }

  return (
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
                  <span className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString('it-IT', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </td>
                <td className="py-5">
                  <select
                    value={order.status}
                    onChange={(e) => onUpdateStatus(order.id, e.target.value)}
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
                        onChange={(e) => onTrackingChange(e.target.value)}
                        placeholder="N. tracking"
                        className="w-28 bg-black border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#00ff80]/50"
                        autoFocus
                      />
                      <button onClick={() => onTrackingSave(order.id)} className="text-[#00ff80] hover:text-white text-xs font-bold">Salva</button>
                      <button onClick={onTrackingCancel} className="text-gray-500 hover:text-white text-xs">X</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {order.tracking ? (
                        <span className="text-xs font-mono text-[#00ff80] bg-[#00ff80]/5 px-2 py-1 rounded border border-[#00ff80]/10">{order.tracking}</span>
                      ) : (
                        <span className="text-xs text-gray-600">—</span>
                      )}
                      <button onClick={() => onTrackingEdit(order.id, order.tracking || "")} className="text-gray-500 hover:text-white text-xs font-bold">Modifica</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
            <div className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString('it-IT', { dateStyle: 'medium' })}</div>
            <div className="flex items-center justify-between gap-2">
              <select
                value={order.status}
                onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                className="flex-1 bg-black border border-white/10 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-[#00ff80]/50 cursor-pointer"
              >
                <option className="bg-black" value="In elaborazione">In elaborazione</option>
                <option className="bg-black" value="Spedito">Spedito</option>
                <option className="bg-black" value="Consegnato">Consegnato</option>
              </select>
              {editingTracking === order.id ? (
                <div className="flex items-center gap-1">
                  <input type="text" value={trackingValue} onChange={(e) => onTrackingChange(e.target.value)} className="w-20 bg-black border border-white/10 rounded-xl px-2 py-2 text-xs outline-none" />
                  <button onClick={() => onTrackingSave(order.id)} className="text-[#00ff80] text-xs font-bold">OK</button>
                </div>
              ) : (
                <button onClick={() => onTrackingEdit(order.id, order.tracking || "")} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                  <Truck size={12} />
                  {order.tracking || "Tracking"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
