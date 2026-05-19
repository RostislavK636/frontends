# Агора - Frontend

Маркетплейс Агора - современный фронтенд на Next.js 14+ с App Router, TypeScript и Tailwind CSS.

## 🚀 Особенности

- ✅ Next.js 14+ App Router
- ✅ TypeScript strict mode
- ✅ Tailwind CSS для стилизации
- ✅ Zustand для управления состоянием корзины
- ✅ Полностью адаптивный дизайн
- ✅ Один заказ = один поставщик
- ✅ REST API интеграция

## 📁 Структура проекта

```
app/
  components/
    ui/           # UI компоненты (кнопки, модалки и т.д.)
    layout/       # Layout компоненты (Header, Footer и т.д.)
  layout.tsx      # Корневой layout
  page.tsx        # Главная страница
  globals.css     # Глобальные стили
components/       # Общие компоненты
lib/              # Утилиты (api.ts и т.д.)
store/            # Zustand stores
types/            # TypeScript типы
public/           # Статические файлы
```

## 🛠️ Установка и запуск

### 1. Установить зависимости

```bash
npm install
```

### 2. Установить Tailwind CSS (если не установлен)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Запустить dev сервер

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### 4. Сборка для продакшена

```bash
npm run build
npm start
```

## 📋 Проверка конфигурации

### Tailwind CSS

- ✅ `tailwind.config.ts` - правильно настроен
- ✅ `postcss.config.js` - включает tailwindcss и autoprefixer
- ✅ `app/globals.css` - содержит @tailwind директивы

### TypeScript

- ✅ `tsconfig.json` - strict mode включен
- ✅ Path alias `@/*` настроен для удобного импорта

### Структура

- ✅ Все компоненты используют PascalCase (Header.tsx)
- ✅ Файлы используют kebab-case где применимо
- ✅ Типы определены в `types/index.ts`

## 📦 Ключевые файлы

- **Header.tsx** - Главный компонент шапки с логотипом и корзиной
- **cart-store.ts** - Zustand store для управления корзиной (один поставщик!)
- **api.ts** - Утилиты для работы с REST API
- **globals.css** - Глобальные стили и Tailwind компоненты

## 🔌 API интеграция

Файл `lib/api.ts` содержит готовые функции для работы с API:

```typescript
import { getSuppliers, getProducts, createOrder } from "@/lib/api";

// Получить поставщиков
const suppliers = await getSuppliers();

// Получить товары
const products = await getProducts();

// Создать заказ
const order = await createOrder(orderData);
```

Базовый URL API можно настроить через переменную окружения `NEXT_PUBLIC_API_URL` в `.env.local`.

## 🎨 Tailwind конфигурация

Кастомные цвета и стили определены в `tailwind.config.ts`:

```typescript
colors: {
  primary: '#6366f1',    // Основной цвет (индиго)
  secondary: '#ec4899',  // Вторичный цвет (розовый)
}
```

Глобальные классы в `app/globals.css`:

- `.container-custom` - контейнер с правильными отступами
- `.btn-primary` - основная кнопка
- `.btn-secondary` - вторичная кнопка
- `.card` - карточка с тенью

## 🚀 Следующие шаги

1. Подключить реальное API
2. Создать страницы:
   - `/suppliers` - список поставщиков
   - `/suppliers/[id]` - детали поставщика
   - `/products` - каталог товаров
   - `/cart` - корзина
   - `/checkout` - оформление заказа
   - `/orders` - мои заказы
3. Добавить аутентификацию
4. Добавить фильтры и поиск

## 📝 Договорённости о кодировании

- **Язык**: TypeScript strict mode
- **Компоненты**: PascalCase (`Header.tsx`)
- **Файлы**: kebab-case (`header.tsx` для компонентов)
- **Типы**: Определены в `types/index.ts`
- **Стили**: Tailwind CSS + глобальные классы в `app/globals.css`
- **Состояние**: Zustand для корзины

## 🐛 Debugging

Для отладки API запросов смотрите сетевые запросы в DevTools.

Для проверки состояния корзины используйте:

```typescript
const store = useCartStore();
console.log(store.items); // элементы в корзине
console.log(store.getTotalItems()); // количество товаров
console.log(store.getTotalPrice()); // общая цена
```

## 📄 Лицензия

Проект Агора - 2026
