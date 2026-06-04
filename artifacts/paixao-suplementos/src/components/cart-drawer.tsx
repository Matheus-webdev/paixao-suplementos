import { useEffect } from "react";
import { useLocation } from "wouter";
import { X, Lock, ShoppingCart, Minus, Plus, Trash2, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { resolveProductImage } from "@/lib/product-images";

function brl(n: number) { return n.toFixed(2).replace(".", ","); }

export function CartDrawer() {
  const { isOpen, close, items, subtotal, updateQuantity, removeItem, loading } = useCart();
  const { user } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  const handleCheckout = () => {
    close();
    navigate("/checkout");
  };

  return (
    <div className="fixed inset-0 z-[200]" data-testid="cart-drawer">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-neutral-50 shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <header className="relative bg-gradient-to-br from-neutral-950 via-black to-neutral-900 text-white px-6 py-5 border-b-4 border-red-600 overflow-hidden">
          <span
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "repeating-linear-gradient(45deg, #ef4444 0 1px, transparent 1px 12px)" }}
            aria-hidden="true"
          />
          <span className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-red-600/30 blur-3xl" aria-hidden="true" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-red-600 shadow-lg shadow-red-600/40 ring-1 ring-red-400/40">
                <ShoppingCart className="w-5 h-5" strokeWidth={2.5} />
              </span>
              <div>
                <h2 className="font-black uppercase italic text-xl tracking-tight leading-none">Seu Carrinho</h2>
                <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-wider font-bold">
                  {items.length} {items.length === 1 ? "item" : "itens"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Fechar carrinho"
              className="group h-10 w-10 rounded-full bg-white/10 hover:bg-red-600 ring-1 ring-white/20 hover:ring-red-600 backdrop-blur-md transition-all flex items-center justify-center"
            >
              <X className="w-5 h-5 transition-transform group-hover:rotate-90" strokeWidth={2.5} />
            </button>
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {!user ? (
            <div className="text-center py-16 px-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-600 to-red-700 shadow-xl shadow-red-600/30 mb-5">
                <Lock className="w-9 h-9 text-white" strokeWidth={2.25} />
              </div>
              <p className="font-black uppercase tracking-wider text-neutral-800 text-base">Entre para usar o carrinho</p>
              <p className="text-neutral-500 text-xs mt-2 mb-6">É grátis e leva poucos segundos.</p>
              <button
                type="button"
                onClick={() => { close(); navigate("/login"); }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black uppercase tracking-wider px-6 py-3 text-sm rounded shadow-lg shadow-red-600/30 hover:-translate-y-0.5 transition-all"
              >
                Entrar / Cadastrar
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
          ) : loading ? (
            <p className="text-center text-neutral-500 py-10 font-bold uppercase tracking-wider text-sm">Carregando...</p>
          ) : items.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 ring-1 ring-neutral-300 mb-5">
                <ShoppingCart className="w-9 h-9 text-neutral-400" strokeWidth={2} />
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-600 text-white text-xs font-black shadow-md">0</span>
              </div>
              <p className="font-black uppercase tracking-wider text-neutral-800 text-base">Carrinho vazio</p>
              <p className="text-neutral-500 text-xs mt-2">Adicione produtos para continuar.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map(item => {
                const price = Number(item.product.price);
                return (
                  <li
                    key={item.id}
                    className="group relative bg-white rounded-xl border border-neutral-200 p-3 shadow-sm hover:shadow-md hover:border-red-300 transition-all"
                  >
                    <div className="flex gap-3">
                      <div className="relative w-20 h-20 bg-gradient-to-br from-neutral-50 to-neutral-100 ring-1 ring-neutral-200 flex items-center justify-center flex-shrink-0 rounded-lg overflow-hidden">
                        <img src={resolveProductImage(item.product.image)} alt={item.product.name} className="w-full h-full object-contain p-1.5" />
                      </div>
                      <div className="flex-1 min-w-0 pr-7">
                        <p className="font-black text-sm leading-tight line-clamp-2 text-neutral-900">{item.product.name}</p>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold mt-0.5">
                          {item.product.brand}{item.flavor ? ` · ${item.flavor}` : ""}
                        </p>
                        <div className="flex items-center justify-between mt-2.5">
                          <div className="inline-flex items-center bg-neutral-100 rounded-full p-0.5 ring-1 ring-neutral-200">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              disabled={item.quantity <= 1}
                              aria-label="Diminuir"
                              className="w-7 h-7 rounded-full hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5 text-neutral-700" strokeWidth={2.75} />
                            </button>
                            <span className="w-7 text-center text-sm font-black text-neutral-900">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label="Aumentar"
                              className="w-7 h-7 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors shadow-sm"
                            >
                              <Plus className="w-3.5 h-3.5" strokeWidth={2.75} />
                            </button>
                          </div>
                          <strong className="text-red-600 text-sm font-black">R$ {brl(price * item.quantity)}</strong>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label="Remover item"
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-neutral-100 hover:bg-red-600 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={2.25} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {user && items.length > 0 && (
          <footer className="border-t border-neutral-200 bg-white px-6 py-5 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-emerald-600 mb-3">
              <Truck className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span>Frete grátis incluso</span>
            </div>
            <div className="flex items-baseline justify-between mb-4 pb-4 border-b border-dashed border-neutral-200">
              <span className="font-black uppercase tracking-wider text-sm text-neutral-700">Subtotal</span>
              <strong className="text-3xl font-black text-red-600 leading-none">R$ {brl(subtotal)}</strong>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              className="group relative inline-flex items-center justify-center gap-2.5 w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black uppercase tracking-wider py-4 text-sm rounded-lg shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:-translate-y-0.5 transition-all overflow-hidden"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="relative">Finalizar compra</span>
              <ArrowRight className="relative w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
            </button>
            <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-neutral-500 uppercase tracking-wider font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.5} />
              <span>Compra 100% segura</span>
            </div>
          </footer>
        )}
      </aside>
    </div>
  );
}
