import React, { Suspense } from "react";
import Link from "next/link";
import { getProducts } from "@/lib/api";
import { SuppliersSection } from "@/app/components/home/suppliers-section";
import { ClientProductsSection } from "@/app/components/home/client-products-section";

async function PopularProducts() {
  const response = await getProducts();
  const products = response.data || [];
  return <ClientProductsSection products={products.slice(0, 8)} />;
}

export default async function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className='bg-gradient-to-r from-primary to-secondary py-12 md:py-20'>
        <div className='container-custom'>
          <div className='text-center text-white'>
            <h1 className='text-4xl md:text-5xl font-bold mb-4'>
              Добро пожаловать в Агору
            </h1>
            <p className='text-lg md:text-xl mb-8 opacity-90'>
              Маркетплейс качественных товаров от проверенных поставщиков
            </p>
            <Link
              href='/suppliers'
              className='btn-primary inline-block bg-white text-primary hover:bg-gray-100'>
              Начать покупки
            </Link>
          </div>
        </div>
      </section>

      {/* Suppliers Section */}
      <Suspense
        fallback={
          <section className='py-12 md:py-16'>
            <div className='container-custom'>
              <div className='h-12 bg-gray-200 rounded animate-pulse mb-4'></div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className='h-48 bg-gray-200 rounded animate-pulse'></div>
                ))}
              </div>
            </div>
          </section>
        }>
        <SuppliersSection />
      </Suspense>

      {/* Products Section */}
      <Suspense
        fallback={
          <section className='py-12 md:py-16 bg-gray-50'>
            <div className='container-custom'>
              <div className='h-12 bg-gray-200 rounded animate-pulse mb-4'></div>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className='h-64 bg-gray-200 rounded animate-pulse'></div>
                ))}
              </div>
            </div>
          </section>
        }>
        <PopularProducts />
      </Suspense>

      {/* CTA Section */}
      <section className='py-12 md:py-16'>
        <div className='container-custom bg-primary text-white rounded-lg p-8 md:p-12'>
          <div className='max-w-2xl'>
            <h2 className='text-3xl font-bold mb-4'>Готовы начать?</h2>
            <p className='text-lg mb-6 opacity-90'>
              Просмотрите тысячи товаров от надежных поставщиков и найдите
              именно то, что вам нужно.
            </p>
            <Link
              href='/suppliers'
              className='inline-block px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors'>
              Перейти к товарам
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
