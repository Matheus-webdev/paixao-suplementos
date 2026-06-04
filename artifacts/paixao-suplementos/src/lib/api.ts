const BASE = "/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init.headers ?? {}),
    },
  });
  let body: unknown = null;
  const text = await res.text();
  if (text) {
    try { body = JSON.parse(text); } catch { body = text; }
  }
  if (!res.ok) {
    const errMsg = (body && typeof body === "object" && "error" in body && typeof (body as { error: unknown }).error === "string")
      ? (body as { error: string }).error
      : `Erro ${res.status}`;
    throw new ApiError(errMsg, res.status);
  }
  return body as T;
}

export const api = {
  get: <T>(p: string) => request<T>(p),
  post: <T>(p: string, body?: unknown) => request<T>(p, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(p: string, body?: unknown) => request<T>(p, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(p: string) => request<T>(p, { method: "DELETE" }),
};

// ====== Types matching backend ======
export type Role = "customer" | "admin";

export type ApiUser = { id: string; name: string; email: string; role: Role };

export type ApiProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  type: string | null;
  weight: string | null;
  price: string;
  description: string;
  image: string;
  flavors: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ApiAddress = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  cep: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  phone: string;
  isDefault: boolean;
  createdAt: string;
};

export type ApiCartItem = {
  id: string;
  productId: string;
  flavor: string | null;
  quantity: number;
  product: ApiProduct;
};

export type ApiOrderItem = {
  id: string;
  orderId: string;
  productId: string | null;
  productName: string;
  brand: string;
  flavor: string | null;
  unitPrice: string;
  quantity: number;
  image: string | null;
};

export type AddressSnapshot = {
  firstName: string; lastName: string; cep: string; street: string; number: string;
  complement?: string | null; neighborhood: string; city: string; state: string; phone: string;
};

export type ApiOrder = {
  id: string;
  orderNumber: number;
  status: "Aguardando Pagamento" | "Pago" | "Preparando" | "Pronto" | "Enviado" | "Entregue" | "Cancelado";
  paymentMethod: "pix" | "credito" | "nubank" | "credito_pix" | "dois_cartoes";
  installments: number;
  subtotal: string;
  total: string;
  addressSnapshot: AddressSnapshot;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiAdminOrder = ApiOrder & {
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: ApiOrderItem[];
};

export const PaymentMethodLabel: Record<ApiOrder["paymentMethod"], string> = {
  pix: "PIX",
  credito: "Cartão de Crédito",
  nubank: "NUBANK",
  credito_pix: "Cartão Crédito + PIX",
  dois_cartoes: "2 Cartões de Crédito",
};
