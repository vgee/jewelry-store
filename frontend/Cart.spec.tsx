import React, { useState } from "react";

type CartItem = {
  id: string;
  name: string;
  unit_amount: number;
  quantity: number;
};

type CartProps = {
  items: CartItem[];
  setItems: (items: CartItem[]) => void;
};

const formatAmount = (amountInCents: number) => {
  return `${(amountInCents / 100).toFixed(2)} USD`;
};

export default function Cart({ items, setItems }: CartProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleQuantityChange = (id: string, value: string) => {
    const parsedQuantity = Number(value);
    const nextItems = items.map((item) =>
      item.id === id
        ? { ...item, quantity: Number.isNaN(parsedQuantity) ? 1 : parsedQuantity }
        : item
    );

    setItems(nextItems);
  };

  const handleRemove = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleCheckout = async () => {
    if (isCheckingOut) {
      return;
    }

    setIsCheckingOut(true);

    try {
      const response = await fetch("http://localhost:4000/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Checkout failed");
      }

      window.location.href = data.url;
    } catch {
      window.alert("Ошибка при создании сессии оплаты");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return <div>Корзина пуста</div>;
  }

  const total = items.reduce((sum, item) => sum + item.unit_amount * item.quantity, 0) / 100;

  return (
    <div>
      <h2>Корзина</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <span>{item.name}</span>
            <span>{formatAmount(item.unit_amount * item.quantity)}</span>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(event) => handleQuantityChange(item.id, event.target.value)}
            />
            <button type="button" onClick={() => handleRemove(item.id)}>
              Удалить
            </button>
          </li>
        ))}
      </ul>

      <div>Итого: {total.toFixed(2)} USD</div>

      <button type="button" onClick={handleCheckout} disabled={isCheckingOut}>
        {isCheckingOut ? "Переход к оплате..." : "Перейти к оплате"}
      </button>
    </div>
  );
}