"use client";
import React from "react";

type Props = {
  id: string;
  name: string;
  price: number; // in cents
  currency?: string;
  onAdd: (item: { id: string; name: string; unit_amount: number; quantity: number }) => void;
};

export default function ProductCard({ id, name, price, currency = "usd", onAdd }: Props) {
  return (
    <div className="border p-4 rounded-md shadow-sm bg-white">
      <h3 className="text-lg font-medium">{name}</h3>
      <p className="text-sm text-zinc-600">{(price / 100).toFixed(2)} {currency.toUpperCase()}</p>
      <button
        onClick={() => onAdd({ id, name, unit_amount: price, quantity: 1 })}
        className="mt-3 inline-block rounded bg-black text-white px-4 py-2"
      >
        Add to cart
      </button>
    </div>
  );
}
