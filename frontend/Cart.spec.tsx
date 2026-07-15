import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Cart from "../Cart";
import "@testing-library/jest-dom";

const mockItems = [
  { id: "item1", name: "Ring", unit_amount: 1000, quantity: 2 },
  { id: "item2", name: "Necklace", unit_amount: 2500, quantity: 1 },
];

describe("Cart", () => {
  const mockSetItems = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ url: "https://checkout.stripe.com/mock_url" }),
        ok: true,
      })
    ) as any;
    // Mock window.location
    Object.defineProperty(window, 'location', {
        value: {
            href: '',
            origin: 'http://localhost:3000'
        },
        writable: true
    });
  });

  it("renders empty cart message when no items are provided", () => {
    render(<Cart items={[]} setItems={mockSetItems} />);
    expect(screen.getByText("Корзина пуста")).toBeInTheDocument();
  });

  it("renders cart items and total correctly", () => {
    render(<Cart items={mockItems} setItems={mockSetItems} />);
    expect(screen.getByText("Ring")).toBeInTheDocument();
    expect(screen.getByText("Necklace")).toBeInTheDocument();
    expect(screen.getByText("45.00 USD")).toBeInTheDocument(); // Total: (10.00 * 2) + 25.00 = 45.00
  });

  it("calls setItems when quantity is updated", () => {
    render(<Cart items={mockItems} setItems={mockSetItems} />);
    const quantityInput = screen.getAllByRole("spinbutton")[0];
    fireEvent.change(quantityInput, { target: { value: "3" } });
    expect(mockSetItems).toHaveBeenCalledWith([
      { id: "item1", name: "Ring", unit_amount: 1000, quantity: 3 },
      { id: "item2", name: "Necklace", unit_amount: 2500, quantity: 1 },
    ]);
  });

  it("calls setItems to remove an item when 'Удалить' is clicked", () => {
    render(<Cart items={mockItems} setItems={mockSetItems} />);
    const removeButton = screen.getAllByRole("button", { name: "Удалить" })[0];
    fireEvent.click(removeButton);
    expect(mockSetItems).toHaveBeenCalledWith([
      { id: "item2", name: "Necklace", unit_amount: 2500, quantity: 1 },
    ]);
  });

  it("calls checkout and redirects on success", async () => {
    render(<Cart items={mockItems} setItems={mockSetItems} />);
    const checkoutButton = screen.getByRole("button", { name: "Перейти к оплате" });
    fireEvent.click(checkoutButton);

    expect(checkoutButton).toBeDisabled();
    expect(screen.getByText("Переход к оплате...")).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:4000/create-checkout-session",
        expect.any(Object)
      );
    });

    await waitFor(() => {
      expect(window.location.href).toBe("https://checkout.stripe.com/mock_url");
    });
  });

  it('shows an alert on checkout failure', async () => {
    global.fetch = vi.fn(() => Promise.reject('API Error')) as any;
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<Cart items={mockItems} setItems={mockSetItems} />);
    const checkoutButton = screen.getByRole('button', { name: 'Перейти к оплате' });
    fireEvent.click(checkoutButton);

    await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Ошибка при создании сессии оплаты');
    });

    expect(checkoutButton).not.toBeDisabled();
    alertSpy.mockRestore();
  });
});