import React from 'react'
import { render, screen } from '@testing-library/react'
import ProductCard from '../app/components/ProductCard'

test('renders product card and add button', () => {
  const handleAdd = vi.fn()
  render(<ProductCard id="p1" name="Test" price={1234} onAdd={handleAdd} />)
  expect(screen.getByText('Test')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument()
})
