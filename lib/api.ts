import { APIResponse, Supplier, Product, Order, CreateRequestDto } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const DEFAULT_PRODUCT_IMAGE =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='Arial, sans-serif' font-size='28'%3EAgora%3C/text%3E%3C/svg%3E";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeSupplier(value: unknown): Supplier | null {
  if (!isRecord(value)) return null;

  const id = typeof value.id === "number" ? value.id : Number((value as any).id);
  const name = typeof value.name === "string" ? value.name : String((value as any).name || "");

  if (Number.isNaN(id) || !name) return null;

  return {
    id,
    name,
    description: typeof value.description === "string" ? value.description : "",
    rating: typeof (value as any).rating === "number" ? (value as any).rating : undefined,
    contact_info: typeof value.contact_info === "string" ? value.contact_info : "",
    logo_url:
      typeof value.logo_url === "string"
        ? value.logo_url
        : typeof (value as any).image === "string"
        ? (value as any).image
        : "",
    price_list_url: typeof value.price_list_url === "string" ? value.price_list_url : "",
    website: typeof value.website === "string" ? value.website : "",
    phone: typeof value.phone === "string" ? value.phone : "",
    email: typeof value.email === "string" ? value.email : "",
    created_at: typeof value.created_at === "string" ? value.created_at : "",
  };
}

function normalizeProduct(value: unknown): Product | null {
  if (!isRecord(value)) return null;

  const id = typeof (value as any).id === "number" ? (value as any).id : Number((value as any).id);
  const supplier_id =
    typeof (value as any).supplier_id === "number"
      ? (value as any).supplier_id
      : Number((value as any).supplier_id || (value as any).supplierId);
  const name =
    typeof (value as any).name === "string"
      ? (value as any).name
      : String((value as any).name || "");
  const price =
    typeof (value as any).price === "number"
      ? (value as any).price
      : Number((value as any).price) || 0;

  if (Number.isNaN(id) || Number.isNaN(supplier_id) || !name) return null;

  return {
    id,
    supplier_id,
    name,
    price,
    unit: typeof (value as any).unit === "string" ? (value as any).unit : "",
    description: typeof (value as any).description === "string" ? (value as any).description : "",
    image_url:
      typeof (value as any).image_url === "string"
        ? (value as any).image_url
        : DEFAULT_PRODUCT_IMAGE,
    card_image_url:
      typeof (value as any).card_image_url === "string" ? (value as any).card_image_url : "",
    price_image_url:
      typeof (value as any).price_image_url === "string" ? (value as any).price_image_url : "",
    base_price_text:
      typeof (value as any).base_price_text === "string" ? (value as any).base_price_text : "",
    inStock: typeof (value as any).inStock === "boolean" ? (value as any).inStock : true,
    created_at: typeof (value as any).created_at === "string" ? (value as any).created_at : "",
  };
}

async function readResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function extractResponseData<T>(payload: unknown): APIResponse<T> {
  if (isRecord(payload)) {
    const record = payload;
    const hasEnvelopeKeys =
      "success" in record || "data" in record || "error" in record || "message" in record;
    const unwrapped =
      record.data ?? (record as any).value ?? (record as any).items ?? (record as any).result;

    if (hasEnvelopeKeys) {
      const success = typeof record.success === "boolean" ? record.success : true;
      const data = unwrapped as T | undefined;
      const message =
        typeof record.error === "string"
          ? record.error
          : typeof record.message === "string"
          ? record.message
          : undefined;

      return {
        success,
        data: (data ?? (success ? (payload as T) : undefined)) as T | undefined,
        error: success ? undefined : message,
        message,
      };
    }

    if (unwrapped !== undefined) {
      return {
        success: true,
        data: unwrapped as T,
      };
    }
  }

  return {
    success: true,
    data: payload as T,
  };
}

export async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<APIResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await readResponseBody(response);
      const errorMessage =
        error && typeof error === "object"
          ? (error as Record<string, unknown>).message ?? (error as Record<string, unknown>).error
          : error;
      return {
        success: false,
        error: typeof errorMessage === "string" ? errorMessage : "API request failed",
      };
    }

    const payload = await readResponseBody(response);
    return extractResponseData<T>(payload);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return { success: false, error: errorMessage };
  }
}

export async function getSuppliers(): Promise<APIResponse<Supplier[]>> {
  const response = await fetchAPI<unknown>("/suppliers");
  if (!response.success) return response as APIResponse<Supplier[]>;

  const payload = response.data as unknown;
  const raw = Array.isArray(payload) ? payload : (payload && (payload as any).value) || [];
  const items = Array.isArray(raw) ? raw : [];

  return {
    success: true,
    data: items.map(normalizeSupplier).filter((s): s is Supplier => s !== null),
  };
}

export async function getSupplierById(id: string): Promise<APIResponse<Supplier>> {
  const response = await getSuppliers();
  if (!response.success || !response.data)
    return { success: false, error: response.error || "Failed to load suppliers" };
  const supplier = response.data.find((item) => String(item.id) === String(id));
  if (!supplier) return { success: false, error: "Supplier not found" };
  return { success: true, data: supplier };
}

export async function getProducts(
  supplierId?: string,
  category?: string
): Promise<APIResponse<Product[]>> {
  const params = new URLSearchParams();
  if (supplierId) params.append("supplier_id", String(supplierId));
  if (category) params.append("category", category);
  const queryString = params.toString();
  const response = await fetchAPI<unknown>(`/products${queryString ? `?${queryString}` : ""}`);
  if (!response.success) return response as APIResponse<Product[]>;

  const payload = response.data as unknown;
  const raw = Array.isArray(payload) ? payload : (payload && (payload as any).value) || [];

  const suppliersResponse = await getSuppliers();
  const suppliersById = new Map<number, string>(
    (suppliersResponse.data || []).map((supplier) => [supplier.id, supplier.name])
  );

  const products = (Array.isArray(raw) ? raw : [])
    .map(normalizeProduct)
    .filter((p): p is Product => p !== null)
    .map((p) => ({ ...p, supplierName: suppliersById.get(p.supplier_id) || undefined }));

  return { success: true, data: products };
}

export async function getProductById(id: string): Promise<APIResponse<Product>> {
  return fetchAPI<Product>(`/products/${id}`);
}

export async function createRequest(requestData: CreateRequestDto): Promise<APIResponse<Order>> {
  return fetchAPI<Order>("/requests", { method: "POST", body: JSON.stringify(requestData) });
}

export async function getRequests(): Promise<APIResponse<Order[]>> {
  return fetchAPI<Order[]>("/requests");
}

export async function getRequestById(id: string): Promise<APIResponse<Order>> {
  return fetchAPI<Order>(`/requests/${id}`);
}
