"use client";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";

const ProductCard = dynamic(() => import("../components/ProductCard"), { ssr: false });
const Cart = dynamic(() => import("../components/Cart"), { ssr: false });

const sampleProducts = [
  { id: "p1", name: "Silver Necklace", price: 2999 },
  { id: "p2", name: "Gold Ring", price: 4999 },
  { id: "p3", name: "Pearl Earrings", price: 1999 },
];

export default function CartPage() {
  const [cartItems, setCartItems] = React.useState<any[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      if (raw) {
        setCartItems(JSON.parse(raw));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (e) {
      // ignore
    }
  }, [cartItems]);

  function handleAdd(item: any) {
    setCartItems((s) => {
      const found = s.find((x) => x.id === item.id);
      if (found) return s.map((x) => (x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x));
      return [...s, { ...item }];
    });
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Магазин бижутерии</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {sampleProducts.map((p) => (
          <ProductCard key={p.id} id={p.id} name={p.name} price={p.price} onAdd={handleAdd} />
        ))}
      </div>

      <div className="mb-8">
        <Cart items={cartItems} setItems={setCartItems} />
      </div>
    </div>
  );
}
