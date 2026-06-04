import { useEffect, useState, Fragment } from "react";
import { Link, useLocation } from "wouter";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/contexts/auth-context";
import { api, type ApiOrder, type ApiOrderItem, PaymentMethodLabel } from "@/lib/api";

type OrderDetail = { order: ApiOrder; items: ApiOrderItem[] };

const STATUS_STYLES: Record<ApiOrder["status"], string> = {
  "Aguardando Pagamento": "bg-orange-500/15 text-orange-600 border-orange-500/30",
  Pago: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  Preparando: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30",
  Pronto: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  Enviado: "bg-green-500/15 text-green-600 border-green-500/30",
  Entregue: "bg-emerald-600/15 text-emerald-700 border-emerald-600/30",
  Cancelado: "bg-red-500/15 text-red-600 border-red-500/30",
};

const STATUS_STEPS: ApiOrder["status"][] = ["Pago", "Preparando", "Pronto", "Enviado", "Entregue"];

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function MyOrders() {
  const [, navigate] = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, OrderDetail>>({});
  const [detailLoading, setDetailLoading] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);

  async function confirmDelivery(id: string) {
    if (!confirm("Confirma que você recebeu este pedido? Essa ação não pode ser desfeita.")) return;
    setConfirming(id);
    try {
      await api.post(`/orders/${id}/confirm-delivery`, {});
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "Entregue" } : o));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao confirmar recebimento.");
    } finally {
      setConfirming(null);
    }
  }

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    setLoading(true); setError("");
    api.get<{ orders: ApiOrder[] }>("/orders")
      .then(d => setOrders(d.orders))
      .catch(err => setError(err instanceof Error ? err.message : "Erro ao carregar pedidos."))
      .finally(() => setLoading(false));
  }, [user]);

  async function toggleExpand(id: string) {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    if (!details[id]) {
      setDetailLoading(id);
      try {
        const d = await api.get<OrderDetail>(`/orders/${id}`);
        setDetails(prev => ({ ...prev, [id]: d }));
      } catch (err) {
        alert(err instanceof Error ? err.message : "Erro ao carregar pedido.");
      } finally {
        setDetailLoading(null);
      }
    }
  }

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tight">
                Meus <span className="text-red-600">Pedidos</span>
              </h1>
              <p className="text-neutral-500 mt-1 text-sm">Acompanhe o status dos seus pedidos.</p>
            </div>
            <Link href="/" className="hidden md:inline-block text-sm font-bold uppercase tracking-wider text-neutral-600 hover:text-red-600">
              ← Continuar comprando
            </Link>
          </div>

          {loading ? (
            <div className="bg-white border border-neutral-200 rounded p-12 text-center text-neutral-500">Carregando...</div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded font-bold">{error}</div>
          ) : orders.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-xl font-black uppercase mb-2">Nenhum pedido ainda</h2>
              <p className="text-neutral-500 mb-6">Quando você fizer um pedido ele aparecerá aqui.</p>
              <Link href="/" className="inline-block bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider py-3 px-6 rounded transition-colors">
                Ver produtos
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(o => {
                const stepIdx = STATUS_STEPS.indexOf(o.status);
                const isCancelled = o.status === "Cancelado";
                const isOpen = expanded === o.id;
                const detail = details[o.id];
                return (
                  <div key={o.id} className="bg-white border border-neutral-200 rounded shadow-sm overflow-hidden">
                    <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                          <span className="font-black text-lg">Pedido #{String(o.orderNumber).padStart(4, "0")}</span>
                          <span className={`text-xs font-black uppercase tracking-wider px-2 py-1 rounded border ${STATUS_STYLES[o.status]}`}>
                            {o.status}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-500">
                          {formatDate(o.createdAt)} · {PaymentMethodLabel[o.paymentMethod]}
                          {o.installments > 1 ? ` · ${o.installments}x` : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs uppercase tracking-wider text-neutral-500">Total</div>
                        <div className="text-2xl font-black text-red-600">R$ {Number(o.total).toFixed(2).replace(".", ",")}</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {o.status === "Enviado" && (
                          <button
                            type="button"
                            onClick={() => confirmDelivery(o.id)}
                            disabled={confirming === o.id}
                            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-black uppercase tracking-wider text-xs px-4 py-2 rounded transition-colors"
                          >
                            {confirming === o.id ? "Confirmando..." : "Recebi o pedido"}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => toggleExpand(o.id)}
                          className="border-2 border-neutral-300 hover:border-red-600 hover:text-red-600 font-bold uppercase tracking-wider text-xs px-4 py-2 rounded transition-colors"
                        >
                          {isOpen ? "Fechar" : "Ver detalhes"}
                        </button>
                      </div>
                    </div>

                    {!isCancelled && (
                      <div className="px-5 md:px-6 pb-5">
                        <div className="flex items-center gap-2">
                          {STATUS_STEPS.map((s, i) => {
                            const reached = i <= stepIdx;
                            return (
                              <Fragment key={s}>
                                <div className="flex flex-col items-center">
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${reached ? "bg-red-600 text-white" : "bg-neutral-200 text-neutral-400"}`}>
                                    {reached ? "✓" : i + 1}
                                  </div>
                                  <span className={`text-[10px] uppercase tracking-wider mt-1 ${reached ? "text-red-600 font-bold" : "text-neutral-400"}`}>
                                    {s}
                                  </span>
                                </div>
                                {i < STATUS_STEPS.length - 1 && (
                                  <div className={`flex-1 h-0.5 ${i < stepIdx ? "bg-red-600" : "bg-neutral-200"}`} />
                                )}
                              </Fragment>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {isOpen && (
                      <div className="border-t border-neutral-200 bg-neutral-50 p-5 md:p-6">
                        {detailLoading === o.id ? (
                          <p className="text-sm text-neutral-500">Carregando detalhes...</p>
                        ) : detail ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-xs font-black uppercase tracking-wider text-neutral-500 mb-3">Itens</h4>
                              <ul className="space-y-2">
                                {detail.items.map(it => (
                                  <li key={it.id} className="flex justify-between text-sm">
                                    <span>
                                      <span className="font-bold">{it.productName}</span>
                                      <span className="text-neutral-500"> — {it.brand}</span>
                                      {it.flavor && <span className="text-neutral-400"> · {it.flavor}</span>}
                                      <span className="text-neutral-400"> · {it.quantity}x</span>
                                    </span>
                                    <span className="font-bold tabular-nums">
                                      R$ {(Number(it.unitPrice) * it.quantity).toFixed(2).replace(".", ",")}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-xs font-black uppercase tracking-wider text-neutral-500 mb-3">Endereço de entrega</h4>
                              <div className="text-sm leading-relaxed text-neutral-700">
                                <div className="font-bold">{detail.order.addressSnapshot.firstName} {detail.order.addressSnapshot.lastName}</div>
                                <div>{detail.order.addressSnapshot.street}, {detail.order.addressSnapshot.number}{detail.order.addressSnapshot.complement ? ` — ${detail.order.addressSnapshot.complement}` : ""}</div>
                                <div>{detail.order.addressSnapshot.neighborhood} · {detail.order.addressSnapshot.city}/{detail.order.addressSnapshot.state}</div>
                                <div>CEP {detail.order.addressSnapshot.cep}</div>
                                <div className="mt-1 text-neutral-500">📞 {detail.order.addressSnapshot.phone}</div>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
