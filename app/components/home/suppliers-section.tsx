import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getSuppliers } from "@/lib/api";
import { Supplier } from "@/types";

export async function SuppliersSection() {
  const response = await getSuppliers();
  const suppliers: Supplier[] = response.data || [];

  return (
    <section className='py-12 md:py-16'>
      <div className='container-custom'>
        <h2 className='text-3xl font-bold mb-8'>Наши поставщики</h2>

        {suppliers.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-600 text-lg'>
              Поставщики пока не добавлены
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {suppliers.map((supplier) => (
              <Link
                key={supplier.id}
                href={`/suppliers/${supplier.id}`}
                className='card p-6 hover:shadow-lg transition-all group overflow-hidden'>
                {/* Logo */}
                {(supplier.logo_url || supplier.image) && (
                  <div className='relative w-full h-40 mb-4 bg-gray-100 rounded-lg overflow-hidden'>
                    <Image
                      src={supplier.logo_url || supplier.image || ""}
                      alt={supplier.name}
                      fill
                      className='object-contain p-4'
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    />
                  </div>
                )}

                {/* Name */}
                <h3 className='text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2'>
                  {supplier.name}
                </h3>

                {/* Description */}
                <p className='text-gray-600 mb-4 text-sm line-clamp-3'>
                  {supplier.description}
                </p>

                {/* Rating */}
                {supplier.rating && (
                  <div className='flex items-center mb-4'>
                    <span className='text-yellow-500'>★</span>
                    <span className='ml-2 font-semibold'>
                      {supplier.rating}
                    </span>
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
        )}
      </div>
    </section>
  );
}
