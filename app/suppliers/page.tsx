import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { getSuppliers } from "@/lib/api";

async function SuppliersList() {
  const response = await getSuppliers();
  const suppliers = response.data || [];

  if (suppliers.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-600 text-lg'>Поставщики пока не добавлены</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {suppliers.map((supplier) => (
        <Link
          key={supplier.id}
          href={`/suppliers/${supplier.id}`}
          className='card p-6 hover:shadow-lg transition-all group overflow-hidden'>
          {/* Logo or Image */}
          {(supplier.logo_url || supplier.image) && (
            <div className='relative w-full h-32 rounded-lg overflow-hidden bg-gray-100 mb-4'>
              <Image
                src={supplier.logo_url || supplier.image || ""}
                alt={supplier.name}
                fill
                className='object-contain p-2 group-hover:scale-105 transition-transform'
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
              />
            </div>
          )}

          {/* Name */}
          <h3 className='text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2'>
            {supplier.name}
          </h3>

          {/* Description */}
          <p className='text-gray-600 text-sm mb-4 line-clamp-3'>
            {supplier.description}
          </p>

          {/* Rating */}
          {supplier.rating && (
            <div className='flex items-center gap-2 mb-4'>
              <span className='text-yellow-500'>★</span>
              <span className='font-semibold text-sm'>{supplier.rating}</span>
            </div>
          )}

          <div className='mt-4 pt-4 border-t border-gray-200'>
            <span className='text-sm font-semibold text-primary group-hover:underline'>
              Смотреть товары →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export const metadata = {
  title: "Поставщики | Агора",
  description: "Каталог всех поставщиков маркетплейса Агора",
};

export default async function SuppliersPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className='border-b border-gray-200 bg-white'>
        <div className='container-custom py-3 text-sm text-gray-600'>
          <Link href='/' className='hover:text-primary transition-colors'>
            Главная
          </Link>
          <span className='mx-2'>/</span>
          <span className='text-gray-900 font-semibold'>Поставщики</span>
        </div>
      </div>

      {/* Hero */}
      <section className='bg-gradient-to-r from-primary to-secondary text-white py-12 md:py-16'>
        <div className='container-custom'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>
            Все поставщики
          </h1>
          <p className='text-lg opacity-90'>
            Найдите товары от проверенных партнёров
          </p>
        </div>
      </section>

      {/* Suppliers List */}
      <section className='py-12 md:py-16'>
        <div className='container-custom'>
          <Suspense
            fallback={
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className='card p-6 animate-pulse'>
                    <div className='w-full h-32 rounded-lg bg-gray-200 mb-4'></div>
                    <div className='h-4 bg-gray-200 rounded mb-2'></div>
                    <div className='h-12 bg-gray-200 rounded mb-4'></div>
                    <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                  </div>
                ))}
              </div>
            }>
            <SuppliersList />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
