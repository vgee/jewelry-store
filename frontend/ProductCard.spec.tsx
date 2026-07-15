import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProductCard from "../ProductCard";
import "@testing-library/jest-dom";

describe("ProductCard", () => {
  const mockOnAdd = vi.fn();
  const productProps = {
    id: "prod_1",
    name: "Gold Necklace",
    price: 50000, // 500.00 USD
    onAdd: mockOnAdd,
  };

  beforeEach(() => {
    mockOnAdd.mockClear();
  });

  it("renders product name and price correctly", () => {
    render(<ProductCard {...productProps} />);
    expect(screen.getByText("Gold Necklace")).toBeInTheDocument();
    expect(screen.getByText("500.00 USD")).toBeInTheDocument();
  });

  it('calls onAdd with correct item details when "Add to cart" is clicked', () => {
    render(<ProductCard {...productProps} />);
    const addButton = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(addButton);
    expect(mockOnAdd).toHaveBeenCalledTimes(1);
    expect(mockOnAdd).toHaveBeenCalledWith({
      id: "prod_1",
      name: "Gold Necklace",
      unit_amount: 50000,
      quantity: 1,
    });
  });

  it("displays the currency correctly when provided", () => {
    render(<ProductCard {...productProps} currency="eur" />);
    expect(screen.getByText("500.00 EUR")).toBeInTheDocument();
  });
});