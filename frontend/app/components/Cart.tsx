"use client";
import React, { useState } from "react";

type Item = {
  id: string;
  name: string;
  unit_amount: number;
  quantity: number;
};

export default function Cart({ items, setItems }: { items: Item[]; setItems: (items: Item[]) => void }) {
  const [loading, setLoading] = useState(false);
  const updateQuantity = (id: string, q: number) => {
    setItems(items.map((it) => (it.id === id ? { ...it, quantity: Math.max(1, q) } : it)));
  };

  const remove = (id: string) => setItems(items.filter((it) => it.id !== id));

  const total = items.reduce((acc, it) => acc + it.unit_amount * it.quantity, 0);

  async function checkout() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, successUrl: window.location.origin + "/checkout/success", cancelUrl: window.location.origin + "/checkout/cancel" }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.id) {
        // fallback
        console.log("Session created:", data);
      } else {
        console.error(data);
        alert("Не удалось создать сессию оплаты");
      }
    } catch (err) {
      console.error(err);
      alert("Ошибка при создании сессии оплаты");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) return <div className="p-4">Корзина пуста</div>;

  return (
    <div className="p-4 border rounded-md bg-white">
      <h2 className="text-xl font-semibold mb-2">Корзина</h2>
      <ul className="space-y-3 mb-4">
        {items.map((it) => (
          <li key={it.id} className="flex items-center justify-between">
            <div>
              <div className="font-medium">{it.name}</div>
              <div className="text-sm text-zinc-600">{(it.unit_amount / 100).toFixed(2)} USD</div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="w-16 border rounded px-2 py-1"
                value={it.quantity}
                onChange={(e) => updateQuantity(it.id, Number(e.target.value))}
                min={1}
              />
              <button className="text-sm text-red-600" onClick={() => remove(it.id)}>
                Удалить
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between mb-3">
        <div className="font-medium">Итого:</div>
        <div className="font-semibold">{(total / 100).toFixed(2)} USD</div>
      </div>
      <button onClick={checkout} disabled={loading} className="w-full rounded bg-black text-white px-4 py-2">
        {loading ? "Переход к оплате..." : "Перейти к оплате"}
      </button>
    </div>
  );
}
