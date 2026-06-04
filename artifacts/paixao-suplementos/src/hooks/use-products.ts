import { useEffect, useState } from "react";
import { api, type ApiProduct } from "@/lib/api";

let cachedProducts: ApiProduct[] | null = null;
let inflight: Promise<ApiProduct[]> | null = null;

function fetchProducts(): Promise<ApiProduct[]> {
  if (cachedProducts) return Promise.resolve(cachedProducts);
  if (!inflight) {
    inflight = api.get<{ products: ApiProduct[] }>("/products")
      .then(d => { cachedProducts = d.products; return d.products; })
      .catch(err => { inflight = null; throw err; });
  }
  return inflight;
}

export function useProducts() {
  const [products, setProducts] = useState<ApiProduct[] | null>(cachedProducts);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (cachedProducts) return;
    let cancelled = false;
    fetchProducts()
      .then(p => { if (!cancelled) setProducts(p); })
      .catch(e => { if (!cancelled) setError(e instanceof Error ? e : new Error("Erro ao carregar produtos.")); });
    return () => { cancelled = true; };
  }, []);

  const bySlug: Record<string, ApiProduct> = {};
  if (products) for (const p of products) bySlug[p.slug] = p;

  return { products, bySlug, error };
}
