import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment");
}

const stripe = new Stripe(stripeSecret, { apiVersion: "2024-11-15" });

type LineItem = {
  price_data?: {
    currency: string;
    product_data: { name: string };
    unit_amount: number;
  };
  price?: string; // price id
  quantity: number;
};

export async function createCheckoutSession(body: any) {
  const { items, successUrl, cancelUrl } = body;
  if (!items || !Array.isArray(items)) {
    throw new Error("Items are required and must be an array");
  }

  const line_items: LineItem[] = items.map((it: any) => {
    if (it.price_id) {
      return { price: it.price_id, quantity: it.quantity || 1 };
    }
    return {
      price_data: {
        currency: it.currency || "usd",
        product_data: { name: it.name || "Item" },
        unit_amount: it.unit_amount,
      },
      quantity: it.quantity || 1,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items,
    success_url: successUrl || "http://localhost:3000/checkout/success",
    cancel_url: cancelUrl || "http://localhost:3000/checkout/cancel",
  });

  return { id: session.id, url: session.url };
}
