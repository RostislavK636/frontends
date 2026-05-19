"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { createRequest } from "@/lib/api";

export default function CheckoutPage() {
  const { items, currentSupplier, getTotalPrice, getTotalItems, clearCart } = useCartStore();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  if (items.length === 0) {
    return (
      <div className="container-custom py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Корзина пуста</h1>
        <p className="text-gray-600 mb-6">Добавьте товары перед оформлением заказа</p>
        <Link href="/" className="btn-primary inline-block">
          Вернуться на главную
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!formData.name.trim()) {
      setErrorMessage("Укажите имя");
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage("Укажите телефон");
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage("Укажите email");
      return;
    }

    if (!currentSupplier) {
      setErrorMessage("Ошибка: не выбран поставщик");
      return;
    }

    setLoading(true);

    try {
      const requestPayload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        comment: formData.notes.trim() || undefined,
        items: items.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
        })),
      };

      const response = await createRequest(requestPayload);

      if (response.success) {
        setSuccessMessage("Заявка успешно отправлена! Проверьте вашу почту для уточнения деталей.");
        clearCart();
        setFormData({ name: "", phone: "", email: "", notes: "" });

        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      } else {
        setErrorMessage(response.error || "Ошибка при отправке заявки");
      }
    } catch {
      setErrorMessage("Ошибка при отправке заявки. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="border-b border-gray-200 bg-white">
        <div className="container-custom py-3 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary transition-colors">
            Главная
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-semibold">Оформление</span>
        </div>
      </div>

      <section className="py-12 md:py-16">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Оформление заказа</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="card p-6">
                <h2 className="text-2xl font-bold mb-6">Контактные данные</h2>

                {successMessage && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded-lg text-green-800">
                    {successMessage}
                  </div>
                )}

                {errorMessage && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg text-red-800">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                      Имя и фамилия *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="Иван Иванов"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="+7 (999) 999-99-99"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="ivan@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-900 mb-2">
                      Комментарий (опционально)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                      placeholder="Укажите дополнительную информацию о доставке или товарах..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Отправка..." : "Отправить заявку"}
                  </button>

                  <Link
                    href="/"
                    className="btn-secondary w-full py-3 text-center text-sm font-semibold"
                  >
                    Вернуться на главную
                  </Link>
                </form>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Ваш заказ</h2>

                {currentSupplier && (
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Поставщик</p>
                    <p className="font-semibold text-gray-900">{currentSupplier.name}</p>
                  </div>
                )}

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 line-clamp-2">{item.name}</p>
                        <p className="text-gray-600">
                          {item.quantity} × ₽{item.price.toLocaleString("ru-RU")}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900 ml-2">
                        ₽{(item.price * item.quantity).toLocaleString("ru-RU")}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Товаров:</span>
                    <span className="font-semibold">{totalItems} шт.</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Подитог:</span>
                    <span className="font-semibold">₽{totalPrice.toLocaleString("ru-RU")}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-gray-900">Сумма:</span>
                  <span className="text-2xl font-bold text-primary">
                    ₽{totalPrice.toLocaleString("ru-RU")}
                  </span>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                  <p className="font-semibold mb-1">💡 Важно</p>
                  <p>
                    После отправки заявки менеджер свяжется с вами по указанному телефону или email.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
