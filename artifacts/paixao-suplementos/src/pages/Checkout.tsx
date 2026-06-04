import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { MapPin, CreditCard, Phone, ShoppingBag, ArrowLeft, Check, ShoppingCart, Trash2, Star } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { AddressModal } from "@/components/address-modal";
import { PaymentMethodModal } from "@/components/payment-method-modal";
import { CreditCardModal, type CreditCardData } from "@/components/credit-card-modal";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { api, PaymentMethodLabel, type ApiAddress, type ApiOrder } from "@/lib/api";
import { resolveProductImage } from "@/lib/product-images";
import logo from "@/assets/logo.png";

type Method = ApiOrder["paymentMethod"];

// Methods handled via Mercado Pago Checkout Pro (redirect-based, no local card form)
const MP_METHODS: Method[] = ["pix", "credito"];
const METHODS_REQUIRING_CARD: Method[] = [];

function brl(n: number) { return n.toFixed(2).replace(".", ","); }

export default function Checkout() {
  const [, navigate] = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { items, subtotal, refresh: refreshCart, loading: cartLoading } = useCart();

  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [addrLoading, setAddrLoading] = useState(true);
  const [addrError, setAddrError] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [method, setMethod] = useState<Method | null>(null);
  const [showMethodModal, setShowMethodModal] = useState(false);

  const [card, setCard] = useState<CreditCardData | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [authLoading, user, navigate]);

  // Load addresses
  useEffect(() => {
    if (!user) return;
    setAddrLoading(true); setAddrError("");
    api.get<{ addresses: ApiAddress[] }>("/addresses").then(d => {
      setAddresses(d.addresses);
      const def = d.addresses.find(a => a.isDefault) ?? d.addresses[0];
      if (def) setSelectedAddressId(def.id);
    }).catch(err => {
      setAddresses([]);
      setAddrError(err instanceof Error ? err.message : "Não foi possível carregar seus endereços.");
    }).finally(() => setAddrLoading(false));
  }, [user]);

  function handleAddressCreated(addr: ApiAddress) {
    setAddresses(prev => [addr, ...prev.filter(a => a.id !== addr.id)]);
    setSelectedAddressId(addr.id);
    setShowAddressModal(false);
  }

  const [addrBusy, setAddrBusy] = useState<string | null>(null);

  async function handleDeleteAddress(id: string) {
    if (!confirm("Excluir este endereço? Essa ação não pode ser desfeita.")) return;
    setAddrBusy(id);
    try {
      await api.delete(`/addresses/${id}`);
      setAddresses(prev => {
        const next = prev.filter(a => a.id !== id);
        // If we deleted the default, the backend promoted the most recent — reflect that
        if (prev.find(a => a.id === id)?.isDefault && next.length > 0 && !next.some(a => a.isDefault)) {
          next[0] = { ...next[0], isDefault: true };
        }
        return next;
      });
      if (selectedAddressId === id) {
        const remaining = addresses.filter(a => a.id !== id);
        const def = remaining.find(a => a.isDefault) ?? remaining[0];
        setSelectedAddressId(def ? def.id : null);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir endereço.");
    } finally {
      setAddrBusy(null);
    }
  }

  async function handleSetDefault(id: string) {
    setAddrBusy(id);
    try {
      await api.patch(`/addresses/${id}/default`);
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao definir endereço padrão.");
    } finally {
      setAddrBusy(null);
    }
  }

  function handleMethodSelect(m: Method) {
    setMethod(m);
    setShowMethodModal(false);
    if (METHODS_REQUIRING_CARD.includes(m)) {
      setCard(null);
      setShowCardModal(true);
    } else {
      setCard(null);
    }
  }

  async function handleSubmit() {
    setError("");
    if (!selectedAddressId) { setError("Selecione um endereço de entrega."); return; }
    if (!method) { setError("Escolha uma forma de pagamento."); return; }
    if (METHODS_REQUIRING_CARD.includes(method) && !card) { setError("Informe os dados do cartão."); return; }

    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        addressId: selectedAddressId,
        paymentMethod: method,
        installments: card?.installments ?? 1,
        paymentData: card ? {
          cardNumber: card.cardNumber,
          cardholder: card.cardholder,
          cpf: card.cpf,
        } : {},
      };
      const { order } = await api.post<{ order: ApiOrder }>("/orders", payload);
      await refreshCart();

      if (MP_METHODS.includes(method)) {
        // Redirect to Mercado Pago Checkout Pro
        const { initPoint } = await api.post<{ initPoint: string }>("/payments/create-preference", { orderId: order.id });
        window.location.href = initPoint;
        return;
      }

      alert(`Pedido #${String(order.orderNumber).padStart(4, "0")} criado com sucesso! Em breve entraremos em contato.`);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar pedido.");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <p className="text-neutral-500 font-bold uppercase">Carregando...</p>
      </div>
    );
  }

  const selectedAddress = addresses.find(a => a.id === selectedAddressId) ?? null;
  const total = subtotal;

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-950">
      <Navbar />

      <main className="py-10 md:py-14">
        <div className="container mx-auto px-4">
          <div className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-950 via-black to-neutral-900 text-white p-8 md:p-10 shadow-xl">
            <span
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{ backgroundImage: "repeating-linear-gradient(45deg, #ef4444 0 1px, transparent 1px 14px)" }}
              aria-hidden="true"
            />
            <span className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-red-600/30 blur-3xl" aria-hidden="true" />
            <span className="pointer-events-none absolute -bottom-24 -left-12 w-64 h-64 rounded-full bg-red-600/10 blur-3xl" aria-hidden="true" />

            <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-5">
                  <span className="inline-flex items-center gap-1.5 bg-red-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-red-600/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Checkout
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Etapa final</span>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <span className="hidden sm:inline-flex items-center justify-center w-14 h-14 rounded-xl bg-red-600 shadow-xl shadow-red-600/40 ring-1 ring-red-400/40 flex-shrink-0">
                    <ShoppingBag className="w-7 h-7" strokeWidth={2.25} />
                  </span>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase italic tracking-tight leading-[1.05]">
                    Finalize seu <span className="text-red-500">pedido</span>
                  </h1>
                </div>
                <p className="text-neutral-400 text-sm max-w-xl">
                  Revise os produtos, escolha o endereço de entrega e a forma de pagamento.
                </p>

                {/* Mini progress steps */}
                <div className="mt-6 flex items-center gap-2 sm:gap-3 text-[10px] font-black uppercase tracking-wider">
                  {[
                    { n: 1, label: "Produtos", done: true },
                    { n: 2, label: "Endereço", done: !!selectedAddressId },
                    { n: 3, label: "Pagamento", done: !!method },
                  ].map((s, i, arr) => (
                    <div key={s.n} className="flex items-center gap-2 sm:gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ring-1 transition-colors ${s.done ? "bg-emerald-500 ring-emerald-400 text-white" : "bg-neutral-800 ring-neutral-700 text-neutral-500"}`}>
                          {s.done ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : s.n}
                        </span>
                        <span className={s.done ? "text-white" : "text-neutral-500"}>{s.label}</span>
                      </div>
                      {i < arr.length - 1 && (
                        <span className={`hidden sm:block w-6 h-px ${s.done ? "bg-emerald-500" : "bg-neutral-700"}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/"
                className="group inline-flex items-center gap-2 self-start md:self-end text-[11px] font-black uppercase tracking-[0.18em] text-neutral-300 hover:text-white bg-white/5 hover:bg-red-600 ring-1 ring-white/10 hover:ring-red-600 backdrop-blur-md px-4 py-2.5 rounded-full transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" strokeWidth={2.5} />
                Voltar ao catálogo
              </Link>
            </div>
          </div>

          {!cartLoading && items.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 ring-1 ring-neutral-300 mb-5">
                <ShoppingCart className="w-9 h-9 text-neutral-400" strokeWidth={2} />
              </div>
              <p className="font-black uppercase tracking-wider text-neutral-800 text-base mb-2">Seu carrinho está vazio</p>
              <p className="text-neutral-500 text-xs mb-6">Adicione produtos antes de finalizar.</p>
              <Link href="/" className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black uppercase tracking-wider px-6 py-3 text-sm rounded shadow-lg shadow-red-600/30 hover:-translate-y-0.5 transition-all">
                Ver produtos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8">
              <div className="space-y-6">
                {/* Items */}
                <section className="bg-white border border-neutral-200 p-6 md:p-8 shadow-sm">
                  <h2 className="text-xl font-black uppercase italic mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-red-600 rounded-sm" />
                    Produtos no pedido
                  </h2>
                  <ul className="divide-y divide-neutral-100">
                    {items.map(item => {
                      const price = Number(item.product.price);
                      return (
                        <li key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                          <div className="w-20 h-20 bg-neutral-100 flex items-center justify-center flex-shrink-0 rounded">
                            <img src={resolveProductImage(item.product.image)} alt={item.product.name} className="w-full h-full object-contain p-1" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-sm">{item.product.name}</p>
                            <p className="text-xs text-neutral-500 uppercase tracking-wider font-bold">
                              {item.product.brand}{item.flavor ? ` · ${item.flavor}` : ""}
                            </p>
                            <p className="text-xs text-neutral-500 mt-1">Quantidade: <strong className="text-neutral-900">{item.quantity}</strong></p>
                          </div>
                          <strong className="text-red-600 font-black self-center">R$ {brl(price * item.quantity)}</strong>
                        </li>
                      );
                    })}
                  </ul>
                </section>

                {/* Address */}
                <section className="bg-white border border-neutral-200 p-6 md:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black uppercase italic flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-red-600 rounded-sm" />
                      Endereço de entrega
                    </h2>
                    <button type="button" onClick={() => setShowAddressModal(true)}
                      className="text-xs font-black uppercase tracking-wider text-red-600 hover:text-red-700">
                      + Novo endereço
                    </button>
                  </div>

                  {addrLoading ? (
                    <p className="text-sm text-neutral-500">Carregando endereços...</p>
                  ) : addrError ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-bold px-3 py-2 rounded">{addrError}</div>
                  ) : addresses.length === 0 ? (
                    <button type="button" onClick={() => setShowAddressModal(true)}
                      className="group w-full border-2 border-dashed border-neutral-300 hover:border-red-600 hover:bg-red-50/50 p-8 text-center transition-all rounded flex flex-col items-center gap-3">
                      <span className="relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
                        <MapPin className="w-7 h-7" strokeWidth={2.25} />
                        <span className="absolute -inset-1 rounded-full border border-red-300/40 group-hover:border-red-400/70 transition-colors" />
                      </span>
                      <span>
                        <p className="font-black uppercase text-sm tracking-wider text-neutral-800">Adicionar primeiro endereço</p>
                        <p className="text-xs text-neutral-500 mt-1">É necessário para a entrega</p>
                      </span>
                    </button>
                  ) : (
                    <div className="space-y-3">
                      {addresses.map(a => {
                        const active = selectedAddressId === a.id;
                        const busy = addrBusy === a.id;
                        return (
                          <div
                            key={a.id}
                            onClick={() => setSelectedAddressId(a.id)}
                            className={`group relative w-full text-left border-2 rounded-xl p-4 flex items-start gap-3 transition-all cursor-pointer ${active ? "border-red-600 bg-red-50" : "border-neutral-200 hover:border-red-400"}`}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedAddressId(a.id); } }}
                            data-testid={`address-card-${a.id}`}
                          >
                            <span className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${active ? "border-red-600 bg-red-600" : "border-neutral-300"}`}>
                              {active && <span className="w-2 h-2 rounded-full bg-white" />}
                            </span>
                            <div className="flex-1 min-w-0 text-sm pr-1">
                              <p className="font-black flex items-center gap-2 flex-wrap">
                                {a.firstName} {a.lastName}
                                {a.isDefault && (
                                  <span className="inline-flex items-center gap-1 text-[9px] bg-red-600 text-white px-1.5 py-0.5 font-black tracking-wider rounded">
                                    <Star className="w-2.5 h-2.5 fill-white" strokeWidth={2.5} />
                                    PADRÃO
                                  </span>
                                )}
                              </p>
                              <p className="text-neutral-600">{a.street}, {a.number}{a.complement ? ` — ${a.complement}` : ""}</p>
                              <p className="text-neutral-600">{a.neighborhood} — {a.city}/{a.state} · CEP {a.cep}</p>
                              <p className="text-neutral-500 text-xs mt-1 flex items-center gap-1.5"><Phone className="w-3 h-3" strokeWidth={2.5} /> {a.phone}</p>
                            </div>
                            <div className="flex flex-col gap-1.5 ml-2 shrink-0">
                              {!a.isDefault && (
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleSetDefault(a.id); }}
                                  disabled={busy}
                                  title="Tornar padrão"
                                  aria-label="Tornar endereço padrão"
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-neutral-200 text-neutral-500 hover:border-amber-400 hover:text-amber-500 hover:bg-amber-50 disabled:opacity-50 transition-all"
                                  data-testid={`set-default-${a.id}`}
                                >
                                  <Star className="w-4 h-4" strokeWidth={2.25} />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleDeleteAddress(a.id); }}
                                disabled={busy}
                                title="Excluir endereço"
                                aria-label="Excluir endereço"
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-neutral-200 text-neutral-500 hover:border-red-600 hover:text-red-600 hover:bg-red-50 disabled:opacity-50 transition-all"
                                data-testid={`delete-address-${a.id}`}
                              >
                                <Trash2 className="w-4 h-4" strokeWidth={2.25} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>

                {/* Payment */}
                <section className="bg-white border border-neutral-200 p-6 md:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black uppercase italic flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-red-600 rounded-sm" />
                      Forma de pagamento
                    </h2>
                    <button type="button" onClick={() => setShowMethodModal(true)}
                      className="text-xs font-black uppercase tracking-wider text-red-600 hover:text-red-700">
                      {method ? "Alterar" : "+ Selecionar"}
                    </button>
                  </div>

                  {!method ? (
                    <button type="button" onClick={() => setShowMethodModal(true)}
                      className="group w-full border-2 border-dashed border-neutral-300 hover:border-red-600 hover:bg-red-50/50 p-8 text-center transition-all rounded flex flex-col items-center gap-3">
                      <span className="relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
                        <CreditCard className="w-7 h-7" strokeWidth={2.25} />
                        <span className="absolute -inset-1 rounded-full border border-red-300/40 group-hover:border-red-400/70 transition-colors" />
                      </span>
                      <span>
                        <p className="font-black uppercase text-sm tracking-wider text-neutral-800">Escolher pagamento</p>
                        <p className="text-xs text-neutral-500 mt-1">PIX ou cartão de crédito</p>
                      </span>
                    </button>
                  ) : (
                    <div className="border-2 border-red-600 bg-red-50 rounded p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-black uppercase text-sm tracking-wider">{PaymentMethodLabel[method]}</p>
                          {card && (
                            <p className="text-xs text-neutral-600 mt-1">
                              Cartão final ****{card.cardNumber.replace(/\D/g, "").slice(-4)} — {card.installments}x de R$ {brl(total / card.installments)}
                            </p>
                          )}
                        </div>
                        {METHODS_REQUIRING_CARD.includes(method) && (
                          <button type="button" onClick={() => setShowCardModal(true)}
                            className="text-xs font-black uppercase tracking-wider text-red-600 hover:text-red-700 underline">
                            {card ? "Editar cartão" : "Adicionar cartão"}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </section>
              </div>

              {/* Summary */}
              <aside className="lg:sticky lg:top-28 h-fit space-y-4">
                <div className="bg-white border border-neutral-200 shadow-sm overflow-hidden">
                  <div className="bg-black text-white p-5 flex items-center gap-3">
                    <img src={logo} alt="Paixão Suplementos" className="h-10 w-auto" />
                    <div>
                      <p className="font-black uppercase tracking-wider text-sm">Resumo do pedido</p>
                      <p className="text-xs text-neutral-400">{items.length} {items.length === 1 ? "item" : "itens"}</p>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Subtotal</span>
                      <strong>R$ {brl(subtotal)}</strong>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-neutral-500">Frete</span>
                      <strong className="text-green-600 font-black uppercase tracking-wider text-xs bg-green-50 border border-green-200 px-2 py-1 rounded">Grátis</strong>
                    </div>
                    {method && (
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">Pagamento</span>
                        <strong className="text-right">{PaymentMethodLabel[method]}</strong>
                      </div>
                    )}
                    {selectedAddress && (
                      <div className="text-xs text-neutral-500 border-t border-neutral-100 pt-3">
                        <p className="font-black uppercase tracking-wider text-neutral-700 mb-1">Entregar em</p>
                        <p>{selectedAddress.street}, {selectedAddress.number}</p>
                        <p>{selectedAddress.city}/{selectedAddress.state}</p>
                      </div>
                    )}
                    <div className="border-t border-neutral-100 pt-4 flex justify-between gap-2">
                      <span className="font-black uppercase text-sm">Total</span>
                      <strong className="text-3xl font-black text-red-600">R$ {brl(total)}</strong>
                    </div>

                    {error && (
                      <p className="bg-red-50 border border-red-200 text-red-700 text-sm font-bold px-3 py-2 rounded">{error}</p>
                    )}

                    <button type="button" onClick={handleSubmit} disabled={submitting || items.length === 0}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white py-4 font-black uppercase tracking-wider transition-colors text-sm">
                      {submitting ? "Enviando..." : "Finalizar pedido"}
                    </button>
                    <p className="text-[10px] text-neutral-500 text-center">Ao finalizar, entraremos em contato pelo WhatsApp para confirmar o envio.</p>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>

      {showAddressModal && (
        <AddressModal onClose={() => setShowAddressModal(false)} onCreated={handleAddressCreated} />
      )}
      {showMethodModal && (
        <PaymentMethodModal initial={method} onClose={() => setShowMethodModal(false)} onSelect={handleMethodSelect} />
      )}
      {showCardModal && (
        <CreditCardModal total={total} onClose={() => setShowCardModal(false)}
          onConfirm={(d) => { setCard(d); setShowCardModal(false); }} />
      )}
    </div>
  );
}
