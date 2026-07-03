Local backend notes

Environment variables:
- `STRIPE_SECRET_KEY` — секретный ключ Stripe
- `STRIPE_WEBHOOK_SECRET` — секрет подписи webhook
- `DATABASE_URL` — URL базы данных

Run locally:

```bash
npm install
npm run dev
```

Testing webhooks with Stripe CLI:

```bash
# forward events to your local server
stripe listen --forward-to localhost:4000/webhook
```

When you create a Checkout Session, Stripe will emit `checkout.session.completed` events you can handle in `/webhook`.
