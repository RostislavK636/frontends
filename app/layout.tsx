import type { Metadata } from "next";
import React from "react";
import { Header } from "@/app/components/layout/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Агора - Маркетплейс",
  description: "Маркетплейс Агора - купите товары от надежных поставщиков",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ru'>
      <body className='min-h-screen bg-gray-50'>
        <Header />
        <main className='flex-1'>{children}</main>
        <footer className='border-t border-gray-200 bg-white py-8 mt-16'>
          <div className='container-custom'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
              <div>
                <h3 className='font-bold text-gray-900'>Агора</h3>
                <p className='text-sm text-gray-600 mt-2'>
                  Маркетплейс для быстрой покупки качественных товаров от
                  проверенных поставщиков.
                </p>
              </div>
              <div>
                <h4 className='font-semibold text-gray-900 mb-4'>Компания</h4>
                <ul className='space-y-2 text-sm text-gray-600'>
                  <li>
                    <a href='/' className='hover:text-primary'>
                      О нас
                    </a>
                  </li>
                  <li>
                    <a href='/' className='hover:text-primary'>
                      Контакты
                    </a>
                  </li>
                  <li>
                    <a href='/' className='hover:text-primary'>
                      Блог
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className='font-semibold text-gray-900 mb-4'>
                  Для поставщиков
                </h4>
                <ul className='space-y-2 text-sm text-gray-600'>
                  <li>
                    <a href='/' className='hover:text-primary'>
                      Стать поставщиком
                    </a>
                  </li>
                  <li>
                    <a href='/' className='hover:text-primary'>
                      Кабинет поставщика
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className='font-semibold text-gray-900 mb-4'>Поддержка</h4>
                <ul className='space-y-2 text-sm text-gray-600'>
                  <li>
                    <a href='/' className='hover:text-primary'>
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a href='/' className='hover:text-primary'>
                      Помощь
                    </a>
                  </li>
                  <li>
                    <a href='/' className='hover:text-primary'>
                      Политика
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className='border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600'>
              <p>&copy; 2026 Агора. Все права защищены.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
