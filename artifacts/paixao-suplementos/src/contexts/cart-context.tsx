import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { api, ApiError, type ApiCartItem } from "@/lib/api";
import { useAuth } from "./auth-context";

type CartContextValue = {
  items: ApiCartItem[];
  subtotal: number;
  loading: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (productId: string, flavor: string | null, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clear: () => Promise<void>;
  refresh: () => Promise<void>;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<ApiCartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const requestVersion = useRef(0);

  const refresh = useCallback(async () => {
    const myVersion = ++requestVersion.current;
    if (!user) {
      setItems([]); setSubtotal(0); return;
    }
    setLoading(true);
    try {
      const data = await api.get<{ items: ApiCartItem[]; subtotal: string }>("/cart");
      if (myVersion !== requestVersion.current) return;
      setItems(data.items);
      setSubtotal(Number(data.subtotal));
    } catch (e) {
      if (myVersion !== requestVersion.current) return;
      if (!(e instanceof ApiError && e.status === 401)) console.error(e);
      setItems([]); setSubtotal(0);
    } finally {
      if (myVersion === requestVersion.current) setLoading(false);
    }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const addItem: CartContextValue["addItem"] = async (productId, flavor, quantity = 1) => {
    await api.post("/cart", { productId, flavor, quantity });
    await refresh();
    setIsOpen(true);
  };

  const updateQuantity: CartContextValue["updateQuantity"] = async (id, quantity) => {
    await api.patch(`/cart/${id}`, { quantity });
    await refresh();
  };

  const removeItem: CartContextValue["removeItem"] = async (id) => {
    await api.delete(`/cart/${id}`);
    await refresh();
  };

  const clear = async () => {
    await api.delete("/cart");
    await refresh();
  };

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, subtotal, loading, isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      addItem, updateQuantity, removeItem, clear, refresh, itemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
