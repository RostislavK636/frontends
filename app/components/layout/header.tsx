"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { CartModal } from "@/app/components/ui/cart-modal";

export const Header: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { items, currentSupplier, getTotalItems, getTotalPrice, removeItem, updateQuantity } =
    useCartStore();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigationLinks = [
    { href: "/", label: "Главная" },
    { href: "/suppliers", label: "Поставщики" },
    { href: "/suppliers", label: "Каталог" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="container-custom flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white font-bold text-lg">
              А
            </div>
            <span className="hidden sm:inline text-xl font-bold text-gray-900">Агора</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Открыть корзину"
          >
            {/* Cart SVG Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.821 4.915h16.021a1.5 1.5 0 0 1 1.47 1.823l-1.005 6.02a1.5 1.5 0 0 1-1.47 1.152H7.07m0 0a6 6 0 1 0 12 0m-12 0a6 6 0 1 1 12 0m0 0a1.5 1.5 0 0 0-3 0m3 0a1.5 1.5 0 0 1-3 0"
              />
            </svg>

            {/* Badge with item count */}
            {mounted && totalItems > 0 && (
              <span className="badge absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="container-custom grid grid-cols-3 py-3 gap-2">
            {navigationLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-center text-sm text-gray-600 hover:text-primary transition-colors py-2 rounded-md hover:bg-gray-50"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={items}
        totalItems={totalItems}
        totalPrice={totalPrice}
        onRemoveItem={removeItem}
        onUpdateQuantity={updateQuantity}
        currentSupplierName={currentSupplier?.name}
      />
    </>
  );
};
