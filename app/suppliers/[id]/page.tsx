import React, { Suspense } from "react";
import { getSupplierById, getProducts } from "@/lib/api";
import { SupplierContent } from "@/app/components/suppliers/supplier-content";

interface SupplierPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: SupplierPageProps) {
  const response = await getSupplierById(params.id);

  if (!response.success || !response.data) {
    return {
      title: "Поставщик не найден | Агора",
    };
  }

  return {
    title: `${response.data.name} | Агора`,
    description: response.data.description || "Товары поставщика на Агоре",
  };
}

async function SupplierDetails({ id }: { id: string }) {
  const [supplierRes, productsRes] = await Promise.all([
    getSupplierById(id),
    getProducts(id),
  ]);

  if (!supplierRes.success || !supplierRes.data) {
    return (
      <div className='container-custom py-12 text-center'>
        <h1 className='text-2xl font-bold text-gray-900 mb-4'>
          Поставщик не найден
        </h1>
        <p className='text-gray-600'>
          Пожалуйста, попробуйте вернуться на главную страницу.
        </p>
      </div>
    );
  }

  const supplier = supplierRes.data;
  const products = productsRes.data || [];

  return <SupplierContent supplier={supplier} products={products} />;
}

export default async function SupplierPage({ params }: SupplierPageProps) {
  return (
    <Suspense
      fallback={
        <div className='container-custom py-12 flex items-center justify-center min-h-96'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
            <p className='text-gray-600'>Загрузка...</p>
          </div>
        </div>
      }>
      <SupplierDetails id={params.id} />
    </Suspense>
  );
}
