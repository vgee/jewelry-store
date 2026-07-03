import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('stripe', () => {
  return {
    default: vi.fn().mockImplementation(() => {
      return {
        checkout: {
          sessions: {
            create: vi.fn().mockResolvedValue({ id: 'sess_123', url: 'https://checkout.test' })
          }
        }
      }
    })
  }
})

beforeEach(() => {
  process.env.STRIPE_SECRET_KEY = 'sk_test_dummy'
})

describe('createCheckoutSession', () => {
  it('throws when items missing', async () => {
    const mod = await import('../checkout')
    await expect(mod.createCheckoutSession({})).rejects.toThrow()
  })

  it('creates session for items', async () => {
    const mod = await import('../checkout')
    const res = await mod.createCheckoutSession({ items: [{ name: 'x', unit_amount: 100, quantity: 1 }] })
    expect(res).toHaveProperty('id')
    expect(res).toHaveProperty('url')
  })
})
