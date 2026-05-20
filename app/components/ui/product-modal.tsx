"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { useCartStore } from "@/store/cart-store";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { addItem, currentSupplier } = useCartStore();

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Use main DB image if available, otherwise card image
    const imageUrl = product.image_url || product.card_image_url;

    const success = addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: imageUrl,
      supplierId: product.supplier_id,
      supplierName: product.supplierName || "",
    });

    if (!success && currentSupplier) {
      setErrorMessage(
        `Вы уже добавили товар от "${currentSupplier.name}". Один заказ = один поставщик.`
      );
    } else if (success) {
      setSuccessMessage(`${product.name} добавлен в корзину`);
      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 1000);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity > 0 && newQuantity <= 999) {
      setQuantity(newQuantity);
    }
  };

  // Image selection: prefer main DB image, then card image
  const imageUrl = product.image_url || product.card_image_url;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4 bg-white rounded-lg shadow-xl overflow-auto max-h-screen">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="flex items-center justify-center">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-200">
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  className="w-full h-full object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col justify-start">
              {/* Supplier */}
              <p className="text-sm text-gray-500 font-medium mb-2">{product.supplierName}</p>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{product.name}</h2>

              {/* Category */}
              {product.category && (
                <p className="text-sm text-gray-600 mb-4">
                  Категория: <span className="font-semibold">{product.category}</span>
                </p>
              )}

              {/* Description */}
              <p className="text-gray-700 text-base leading-relaxed mb-6">{product.description}</p>

              {/* Stock Status */}
              <div className="mb-6">
                {product.inStock ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                    ✓ В наличии
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                    ✗ Нет в наличии
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="mb-6 pt-4 border-t border-gray-200">
                <p className="text-4xl font-bold text-primary mb-2">
                  {product.base_price_text || `₽${product.price.toLocaleString("ru-RU")}`}{" "}
                  {product.unit ? (
                    <span className="text-base text-gray-600">/ {product.unit}</span>
                  ) : null}
                </p>
                <p className="text-sm text-gray-600">за единицу</p>

                {product.price_image_url && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">Прайс</h4>
                    <div className="relative w-full h-56 bg-gray-100 rounded overflow-hidden">
                      <Image
                        src={product.price_image_url}
                        alt="Price"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Messages */}
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg text-red-800 text-sm">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-300 rounded-lg text-green-800 text-sm">
                  {successMessage}
                </div>
              )}

              {/* Quantity */}
              {product.inStock && (
                <>
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-3 font-medium">Количество</p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="flex items-center justify-center w-10 h-10 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          if (val > 0 && val <= 999) {
                            setQuantity(val);
                          }
                        }}
                        className="w-16 text-center border border-gray-300 rounded py-2 text-lg font-semibold"
                      />
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= 999}
                        className="flex items-center justify-center w-10 h-10 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        +
                      </button>
                      <span className="text-sm text-gray-600 ml-auto">Макс. 999 шт.</span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className="btn-primary w-full py-3 text-lg font-semibold mb-3"
                  >
                    Добавить в корзину
                  </button>
                </>
              )}

              {/* Close Button */}
              <button onClick={onClose} className="btn-secondary w-full py-2 text-sm">
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
