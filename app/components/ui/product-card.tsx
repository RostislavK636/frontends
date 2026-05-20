"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onAction: () => void;
  actionLabel: string;
  actionDisabled?: boolean;
  showSupplier?: boolean;
  showCategory?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAction,
  actionLabel,
  actionDisabled = false,
  showSupplier = true,
  showCategory = false,
}) => {
  // Image selection: prefer main photo from DB, then card image, then fallback
  const imageUrl = product.image_url || product.card_image_url;

  const displayPrice = product.base_price_text || `${product.price} ₽`;

  return (
    <article className="card overflow-hidden hover:shadow-lg transition-all">
      <div className="aspect-video overflow-hidden bg-gray-200 relative">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      <div className="p-4">
        {showSupplier && <p className="text-sm text-gray-500 mb-2">{product.supplierName}</p>}

        {showCategory && product.category && (
          <p className="text-xs text-gray-500 mb-1">{product.category}</p>
        )}

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

        <div className="flex flex-col gap-3">
          <span className="text-xl font-bold text-primary">
            {displayPrice}{" "}
            {product.unit ? <span className="text-sm text-gray-600">/ {product.unit}</span> : null}
          </span>
          <button
            onClick={onAction}
            className="btn-primary w-full py-2 px-3 font-semibold transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={actionDisabled}
          >
            {actionLabel}
          </button>
        </div>

        {product.inStock === false && (
          <p className="text-sm text-red-600 mt-2 font-semibold">Нет в наличии</p>
        )}
      </div>
    </article>
  );
};
