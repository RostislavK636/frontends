"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CartItem } from "@/types";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  onRemoveItem: (productId: number) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  currentSupplierName?: string;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  items,
  totalItems,
  totalPrice,
  onRemoveItem,
  onUpdateQuantity,
  currentSupplierName,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="fixed right-0 top-0 h-screen w-full sm:w-96 bg-white shadow-lg z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold">Корзина</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 transition-colors">
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
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12 text-gray-400 mb-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.821 4.915h16.021a1.5 1.5 0 0 1 1.47 1.823l-1.005 6.02a1.5 1.5 0 0 1-1.47 1.152H7.07m0 0a6 6 0 1 0 12 0m-12 0a6 6 0 1 1 12 0m0 0a1.5 1.5 0 0 0-3 0m3 0a1.5 1.5 0 0 1-3 0"
                />
              </svg>
              <p className="text-gray-600 mb-4">Корзина пуста</p>
              <button onClick={onClose} className="btn-primary text-sm">
                Продолжить покупки
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {currentSupplierName && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <span className="font-semibold">Поставщик:</span> {currentSupplierName}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">Один заказ = один поставщик</p>
                </div>
              )}

              {items.map((item) => (
                <div key={item.productId} className="card p-3 hover:shadow-md transition-shadow">
                  <div className="flex gap-3">
                    {/* Image */}
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="w-full h-full object-cover"
                        sizes="64px"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                        {item.name}
                      </p>
                      <p className="text-sm font-bold text-primary mt-1">
                        ₽{(item.price * item.quantity).toLocaleString("ru-RU")}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                          className="flex items-center justify-center w-6 h-6 rounded border border-gray-300 hover:bg-gray-100 transition-colors"
                        >
                          −
                        </button>
                        <span className="text-sm font-semibold w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                          className="flex items-center justify-center w-6 h-6 rounded border border-gray-300 hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                        <button
                          onClick={() => onRemoveItem(item.productId)}
                          className="ml-auto text-red-600 hover:text-red-700 text-xs font-semibold"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Товаров:</span>
              <span className="font-semibold">{totalItems}</span>
            </div>
            <div className="flex items-center justify-between text-lg font-bold border-t border-gray-200 pt-3">
              <span>Сумма:</span>
              <span className="text-primary">₽{totalPrice.toLocaleString("ru-RU")}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="btn-primary w-full text-center py-3 font-semibold"
            >
              Оформить заказ
            </Link>
            <button onClick={onClose} className="btn-secondary w-full py-2 text-sm">
              Продолжить покупки
            </button>
          </div>
        )}
      </div>
    </>
  );
};
