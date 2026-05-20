"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { useCartStore } from "@/store/cart-store";
import { ProductCard } from "@/app/components/ui/product-card";

interface ClientProductsSectionProps {
  products: Product[];
}

export const ClientProductsSection: React.FC<ClientProductsSectionProps> = ({ products }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { addItem, currentSupplier } = useCartStore();

  const handleAddToCart = (product: Product) => {
    setErrorMessage(null);

    const success = addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image_url || product.card_image_url,
      supplierId: product.supplier_id,
      supplierName: product.supplierName || "",
    });

    if (!success && currentSupplier) {
      setErrorMessage(
        `Вы уже добавили товар от "${currentSupplier.name}". Один заказ = один поставщик.`
      );
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container-custom">
        <h2 className="text-3xl font-bold mb-8">Популярные товары</h2>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg text-red-800 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
              {errorMessage}
            </span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-600 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Товары пока не добавлены</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAction={() => handleAddToCart(product)}
                actionLabel={product.inStock ? "В корзину" : "Нет"}
                actionDisabled={!product.inStock}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
