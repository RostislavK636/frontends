"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Supplier, Product } from "@/types";
import { ProductModal } from "@/app/components/ui/product-modal";
import { ProductCard } from "@/app/components/ui/product-card";

interface SupplierContentProps {
  supplier: Supplier;
  products: Product[];
}

export const SupplierContent: React.FC<SupplierContentProps> = ({
  supplier,
  products,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const inStockProducts = products.filter((p) => p.inStock);

  return (
    <>
      {/* Breadcrumb */}
      <div className='border-b border-gray-200 bg-white'>
        <div className='container-custom py-3 text-sm text-gray-600'>
          <Link href='/' className='hover:text-primary transition-colors'>
            Главная
          </Link>
          <span className='mx-2'>/</span>
          <Link
            href='/suppliers'
            className='hover:text-primary transition-colors'>
            Поставщики
          </Link>
          <span className='mx-2'>/</span>
          <span className='text-gray-900 font-semibold'>{supplier.name}</span>
        </div>
      </div>

      {/* Header Section with Logo and Info */}
      <section className='py-12 md:py-16 bg-white border-b border-gray-200'>
        <div className='container-custom'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 items-start'>
            {/* Logo */}
            <div className='md:col-span-1 flex justify-center md:justify-start'>
              {supplier.logo_url ? (
                <div className='relative w-full h-64 md:h-80 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center'>
                  <Image
                    src={supplier.logo_url}
                    alt={supplier.name}
                    fill
                    className='object-contain p-4'
                    priority
                    sizes='(max-width: 768px) 100vw, 33vw'
                  />
                </div>
              ) : (
                <div className='w-full h-64 md:h-80 bg-gray-100 rounded-lg flex items-center justify-center'>
                  <div className='text-center'>
                    <p className='text-gray-400 text-lg'>Логотип не загружен</p>
                  </div>
                </div>
              )}
            </div>

            {/* Info */}
            <div className='md:col-span-2'>
              {/* Name */}
              <h1 className='text-4xl md:text-5xl font-bold mb-4'>
                {supplier.name}
              </h1>

              {/* Rating */}
              {supplier.rating && (
                <div className='flex items-center gap-3 mb-6'>
                  <span className='text-2xl'>★★★★★</span>
                  <span className='text-lg font-semibold'>
                    {supplier.rating} из 5
                  </span>
                </div>
              )}

              {/* Description */}
              {supplier.description && (
                <div className='mb-6'>
                  <h2 className='text-lg font-semibold mb-2'>О поставщике</h2>
                  <p className='text-gray-700 leading-relaxed'>
                    {supplier.description}
                  </p>
                </div>
              )}

              {/* Contact Info */}
              {(supplier.contact_info || supplier.phone || supplier.email) && (
                <div className='mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200'>
                  <h3 className='text-sm font-semibold text-blue-900 mb-2'>
                    Контактная информация
                  </h3>
                  {supplier.contact_info && (
                    <p className='text-blue-800 whitespace-pre-wrap'>
                      {supplier.contact_info}
                    </p>
                  )}
                  {supplier.phone && (
                    <p className='text-blue-800 mt-2'>
                      Телефон: {supplier.phone}
                    </p>
                  )}
                  {supplier.email && (
                    <p className='text-blue-800 mt-1'>
                      Email: {supplier.email}
                    </p>
                  )}
                </div>
              )}

              {/* Address */}
              {supplier.address && (
                <div className='mb-6'>
                  <h3 className='text-sm font-semibold text-gray-700 mb-2'>
                    Адрес
                  </h3>
                  <p className='text-gray-600'>{supplier.address}</p>
                </div>
              )}

              {/* Price List Button */}
              {supplier.price_list_url && (
                <div className='mb-6'>
                  <a
                    href={supplier.price_list_url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold'>
                    📥 Скачать прайс-лист
                  </a>
                </div>
              )}

              {supplier.website && (
                <div className='mb-4'>
                  <a
                    href={supplier.website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary hover:underline'>
                    Веб-сайт поставщика
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className='py-12 md:py-16'>
        <div className='container-custom'>
          <div className='flex items-center justify-between mb-8'>
            <h2 className='text-3xl font-bold'>Товары поставщика</h2>
            <span className='text-gray-600 text-sm md:text-base'>
              Всего: {products.length} товаров
            </span>
          </div>

          {products.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-gray-600 text-lg mb-6'>
                У этого поставщика пока нет товаров
              </p>
              <Link href='/suppliers' className='btn-primary inline-block'>
                Вернуться к поставщикам
              </Link>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12'>
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAction={() => handleProductClick(product)}
                    actionLabel='Подробнее'
                    actionDisabled={false}
                    showSupplier={false}
                    showCategory={true}
                  />
                ))}
              </div>

              {inStockProducts.length === 0 && (
                <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center'>
                  <p className='text-yellow-800'>
                    Все товары этого поставщика временно недоступны
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Related Suppliers Section */}
      <section className='py-12 md:py-16 bg-gray-50'>
        <div className='container-custom'>
          <h2 className='text-2xl font-bold mb-6'>Другие поставщики</h2>
          <Link href='/suppliers' className='btn-primary inline-block'>
            Смотреть всех поставщиков
          </Link>
        </div>
      </section>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSuccess={() => setSelectedProduct(null)}
      />
    </>
  );
};
