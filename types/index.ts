export interface Supplier {
  id: number;
  name: string;
  description: string;
  rating?: number;
  contact_info: string;
  address?: string;
  logo_url: string;
  price_list_url: string;
  website: string;
  phone: string;
  email: string;
  created_at: string;
  image?: string;
}

export interface Product {
  id: number;
  supplier_id: number;
  name: string;
  price: number;
  unit: string;
  description: string;
  image_url: string;
  card_image_url: string;
  price_image_url: string;
  base_price_text: string;
  created_at: string;
  supplierName?: string;
  category?: string;
  inStock?: boolean;
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  supplierId: number;
  supplierName: string;
}

export interface RequestItem {
  product_id: number;
  quantity: number;
}

export interface CreateRequestDto {
  name: string;
  phone: string;
  email: string;
  comment?: string;
  items: RequestItem[];
}

export interface Order {
  id: string;
  supplierId: string;
  items: CartItem[];
  totalPrice: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
