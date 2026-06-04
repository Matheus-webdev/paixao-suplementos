import { Fragment, useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "wouter";
import {
  RefreshCw, Store, LogOut, Package, Phone, ChevronDown, ChevronUp, Trash2,
  ShoppingBag, CreditCard, MapPin, Calendar, Mail, User as UserIcon,
  Clock, CheckCircle2, ChefHat, PackageCheck, Truck, Home, Ban,
  TrendingUp, Filter, ArrowRight,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { api, ApiError, PaymentMethodLabel, type ApiAdminOrder, type ApiOrder } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";

type OrderStatus = ApiOrder["status"];
const STATUSES: OrderStatus[] = ["Aguardando Pagamento", "Pago", "Preparando", "Pronto", "Enviado", "Entregue", "Cancelado"];

type StatusCfg = {
  text: string;
  ring: string;
  bg: string;
  glow: string;
  icon: typeof Clock;
  short: string;
};

const statusConfig: Record<OrderStatus, StatusCfg> = {
  "Aguardando Pagamento": { text: "text-orange-300", ring: "ring-orange-500/40", bg: "bg-orange-950/40", glow: "shadow-orange-500/30", icon: Clock,        short: "Aguard. Pgto" },
  Pago:                   { text: "text-emerald-300", ring: "ring-emerald-500/40", bg: "bg-emerald-950/40", glow: "shadow-emerald-500/30", icon: CheckCircle2, short: "Pago" },
  Preparando:             { text: "text-yellow-300", ring: "ring-yellow-500/40", bg: "bg-yellow-950/40", glow: "shadow-yellow-500/30", icon: ChefHat,      short: "Preparando" },
  Pronto:                 { text: "text-sky-300",    ring: "ring-sky-500/40",    bg: "bg-sky-950/40",    glow: "shadow-sky-500/30",    icon: PackageCheck, short: "Pronto" },
  Enviado:                { text: "text-indigo-300", ring: "ring-indigo-500/40", bg: "bg-indigo-950/40", glow: "shadow-indigo-500/30", icon: Truck,        short: "Enviado" },
  Entregue:               { text: "text-teal-300",   ring: "ring-teal-500/40",   bg: "bg-teal-950/40",   glow: "shadow-teal-500/30",   icon: Home,         short: "Entregue" },
  Cancelado:              { text: "text-red-300",    ring: "ring-red-500/40",    bg: "bg-red-950/40",    glow: "shadow-red-500/30",    icon: Ban,          short: "Cancelado" },
};

function brl(s: string | number) {
  const n = typeof s === "string" ? Number(s) : s;
  return `R$ ${n.toFixed(2).replace(".", ",")}`;
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR") + " " + new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

/* ---------- Custom empty-state SVG ---------- */
function EmptyBoxArt({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 200" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="boxTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7f1d1d" />
          <stop offset="100%" stopColor="#450a0a" />
        </linearGradient>
        <linearGradient id="boxBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#404040" />
          <stop offset="100%" stopColor="#171717" />
        </linearGradient>
        <radialGradient id="boxGlow" cx="50%" cy="100%" r="50%">
          <stop offset="0%" stopColor="#dc2626" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="120" cy="180" rx="90" ry="14" fill="url(#boxGlow)" />
      {/* Box body */}
      <path d="M60 80 L120 110 L180 80 L180 150 L120 180 L60 150 Z" fill="url(#boxBody)" stroke="#525252" strokeWidth="1.5" />
      {/* Box top */}
      <path d="M60 80 L120 50 L180 80 L120 110 Z" fill="url(#boxTop)" stroke="#dc2626" strokeWidth="1.5" />
      {/* Tape */}
      <path d="M120 50 L120 110 L120 180" stroke="#dc2626" strokeWidth="2.5" opacity="0.7" />
      <path d="M105 95 L135 95" stroke="#fca5a5" strokeWidth="1.5" opacity="0.6" />
      {/* Sparkles */}
      <circle cx="200" cy="70" r="2" fill="#fca5a5" />
      <circle cx="40" cy="90" r="1.5" fill="#fca5a5" opacity="0.7" />
      <circle cx="210" cy="120" r="1.5" fill="#dc2626" opacity="0.8" />
      <circle cx="30" cy="140" r="2" fill="#dc2626" opacity="0.6" />
    </svg>
  );
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { user, loading: authLoading, logout } = useAuth();
  const [orders, setOrders] = useState<ApiAdminOrder[]>([]);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "Todos">("Todos");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true); else setLoading(true);
    setError("");
    try {
      const data = await api.get<{ orders: ApiAdminOrder[] }>("/admin/orders");
      setOrders(data.orders);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar pedidos.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "admin") { navigate("/admin/login"); return; }
    load();
  }, [authLoading, user, navigate, load]);

  async function handleLogout() {
    await logout();
    navigate("/admin/login");
  }

  async function changeStatus(id: string, status: OrderStatus) {
    try {
      await api.patch(`/admin/orders/${id}/status`, { status });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro ao atualizar status.");
    }
  }

  async function deleteOrder(id: string) {
    if (!confirm("Excluir este pedido permanentemente?")) return;
    try {
      await api.delete(`/admin/orders/${id}`);
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (e) {
      if (e instanceof ApiError) alert(e.message);
    }
  }

  const counts: Record<OrderStatus, number> = {
    "Aguardando Pagamento": orders.filter(o => o.status === "Aguardando Pagamento").length,
    Pago:       orders.filter(o => o.status === "Pago").length,
    Preparando: orders.filter(o => o.status === "Preparando").length,
    Pronto:     orders.filter(o => o.status === "Pronto").length,
    Enviado:    orders.filter(o => o.status === "Enviado").length,
    Entregue:   orders.filter(o => o.status === "Entregue").length,
    Cancelado:  orders.filter(o => o.status === "Cancelado").length,
  };

  const totalRevenue = orders
    .filter(o => o.status !== "Cancelado" && o.status !== "Aguardando Pagamento")
    .reduce((sum, o) => sum + Number(o.total), 0);

  const visible = filterStatus === "Todos" ? orders : orders.filter(o => o.status === filterStatus);

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Background atmosphere */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-red-700/10 blur-[160px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-red-900/15 blur-[160px]" />
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      {/* NAV */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/70 border-b border-red-900/40">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent" />
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-red-600/40 blur-md" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-600/40 ring-1 ring-red-500/50">
                <img src={logo} alt="" className="w-7 h-7 object-contain" />
              </div>
            </div>
            <div className="leading-none">
              <p className="font-black uppercase tracking-wider text-sm">Painel <span className="text-red-500">Admin</span></p>
              <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mt-1">{user?.name ?? "Administrador"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => load(true)}
              disabled={refreshing}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-neutral-300 hover:text-white px-3 py-2 rounded-full hover:bg-white/5 transition-all"
              data-testid="button-refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Atualizar
            </button>
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-neutral-300 hover:text-white px-3 py-2 rounded-full hover:bg-white/5 transition-all"
            >
              <Store className="w-3.5 h-3.5" />
              Ver loja
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-gradient-to-br from-neutral-800 to-neutral-900 hover:from-red-600 hover:to-red-700 ring-1 ring-neutral-700 hover:ring-red-500 px-4 py-2 rounded-full transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-4 py-8 sm:py-12">
        {/* HERO */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="h-[3px] w-10 bg-gradient-to-r from-red-600 to-red-400 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-400">Painel administrativo</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black uppercase italic tracking-tighter leading-[0.85]">
              Gestão de{" "}
              <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent pr-2 inline-block">
                Pedidos
              </span>
            </h1>
            <p className="text-neutral-400 text-sm mt-3 max-w-md">Acompanhe e atualize o status de cada pedido vindo do site em tempo real.</p>
          </div>

          {/* Revenue badge */}
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-emerald-600/60 via-emerald-900/30 to-neutral-900 shadow-lg shadow-emerald-600/20">
            <div className="rounded-2xl bg-neutral-950/95 backdrop-blur px-6 py-4 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md shadow-emerald-500/40">
                <TrendingUp className="w-5 h-5 text-white" />
              </span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Receita confirmada</p>
                <p className="text-2xl font-black text-white" data-testid="text-revenue">{brl(totalRevenue)}</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-950/60 border border-red-900 text-red-300 px-5 py-4 mb-6 rounded-2xl font-medium text-sm flex items-center gap-3">
            <Ban className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* STATUS KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {STATUSES.map(s => {
            const cfg = statusConfig[s];
            const Icon = cfg.icon;
            const isActive = filterStatus === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setFilterStatus(isActive ? "Todos" : s)}
                className={`group relative text-left rounded-2xl p-[1px] transition-all ${
                  isActive
                    ? "bg-gradient-to-br from-red-500 to-red-800 shadow-lg shadow-red-600/40 scale-[1.02]"
                    : "bg-gradient-to-br from-neutral-800 to-neutral-900 hover:from-neutral-700 hover:to-neutral-800"
                }`}
                data-testid={`kpi-${s}`}
              >
                <div className="rounded-2xl bg-neutral-950/95 backdrop-blur p-5 h-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`w-9 h-9 rounded-xl ${cfg.bg} ring-1 ${cfg.ring} flex items-center justify-center shadow ${cfg.glow}`}>
                      <Icon className={`w-4 h-4 ${cfg.text}`} />
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-[0.25em] ${cfg.text} opacity-80`}>{cfg.short}</span>
                  </div>
                  <p className="text-4xl font-black text-white leading-none tabular-nums">{counts[s]}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mt-1.5">
                    {counts[s] === 1 ? "pedido" : "pedidos"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* PANEL */}
        <div className="relative rounded-3xl p-[1px] bg-gradient-to-br from-red-700/40 via-neutral-800 to-neutral-900 shadow-[0_30px_60px_-20px_rgba(220,38,38,0.3)]">
          <div className="rounded-3xl bg-neutral-950/95 backdrop-blur overflow-hidden">
            {/* Header */}
            <div className="flex flex-wrap items-center gap-4 p-5 sm:p-6 border-b border-neutral-900">
              <div className="flex items-center gap-3 mr-auto">
                <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-md shadow-red-600/40">
                  <ShoppingBag className="w-4 h-4 text-white" />
                </span>
                <div className="leading-none">
                  <h2 className="font-black uppercase tracking-wider text-sm">Lista de pedidos</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mt-1">
                    {visible.length} {visible.length === 1 ? "registro" : "registros"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-3.5 h-3.5 text-neutral-500 mr-1" />
                {(["Todos", ...STATUSES] as (OrderStatus | "Todos")[]).map(s => {
                  const isActive = filterStatus === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFilterStatus(s)}
                      className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ring-1 transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-red-600 to-red-700 ring-red-500 text-white shadow shadow-red-600/40"
                          : "bg-neutral-900/60 ring-neutral-800 text-neutral-400 hover:ring-red-700/60 hover:text-white"
                      }`}
                      data-testid={`filter-${s}`}
                    >
                      {s === "Aguardando Pagamento" ? "Aguard. Pgto" : s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Body */}
            {loading ? (
              <div className="py-20 text-center">
                <div className="inline-block w-10 h-10 border-2 border-red-600/30 border-t-red-500 rounded-full animate-spin mb-4" />
                <p className="text-neutral-500 font-black uppercase tracking-widest text-xs">Carregando pedidos...</p>
              </div>
            ) : visible.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <EmptyBoxArt className="w-48 h-40 mb-2" />
                <p className="font-black uppercase tracking-wider text-neutral-300 text-base mt-2">
                  {filterStatus !== "Todos" ? `Nenhum pedido ${filterStatus.toLowerCase()}` : "Nenhum pedido ainda"}
                </p>
                <p className="text-neutral-500 text-xs mt-2 max-w-sm">
                  Os pedidos aparecerão aqui assim que forem criados pelos clientes.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-900">
                {visible.map(order => {
                  const cfg = statusConfig[order.status];
                  const StatusIcon = cfg.icon;
                  const isOpen = expanded === order.id;
                  const addr = order.addressSnapshot;
                  return (
                    <Fragment key={order.id}>
                      <div className="p-5 sm:p-6 hover:bg-white/[0.02] transition-colors" data-testid={`order-${order.orderNumber}`}>
                        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto_auto_auto] gap-5 lg:gap-6 items-start">
                          {/* Order # */}
                          <div className="flex lg:flex-col items-center lg:items-start gap-3 lg:gap-1 min-w-[80px]">
                            <div className="relative">
                              <span className="absolute -inset-1 rounded-xl bg-red-600/30 blur-md" aria-hidden="true" />
                              <span className="relative inline-flex items-center justify-center min-w-[58px] h-[58px] rounded-xl bg-gradient-to-br from-red-600 to-red-800 ring-1 ring-red-500/60 shadow-lg shadow-red-600/40 px-2">
                                <span className="text-base font-black text-white tabular-nums">#{String(order.orderNumber).padStart(4, "0")}</span>
                              </span>
                            </div>
                            <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500 mt-2">
                              <Calendar className="w-3 h-3" />
                              {fmtDate(order.createdAt)}
                            </div>
                            <div className="lg:hidden flex flex-col">
                              <p className="font-black text-sm text-white">{order.customerName}</p>
                              <p className="text-[10px] text-neutral-500">{fmtDate(order.createdAt)}</p>
                            </div>
                          </div>

                          {/* Customer + Items */}
                          <div className="space-y-2.5 min-w-0">
                            <div className="hidden lg:flex items-center gap-2">
                              <UserIcon className="w-3.5 h-3.5 text-neutral-500" />
                              <p className="font-black text-sm text-white">{order.customerName}</p>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400">
                                <Mail className="w-3 h-3" />
                                <span className="truncate max-w-[200px]">{order.customerEmail}</span>
                              </span>
                              <a
                                href={`https://wa.me/55${addr.phone.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 hover:text-emerald-300 font-bold"
                              >
                                <Phone className="w-3 h-3" />
                                {addr.phone}
                              </a>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap text-[11px]">
                              <span className="inline-flex items-center gap-1.5 text-neutral-400">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate max-w-[260px]">{addr.street}, {addr.number} — {addr.city}/{addr.state}</span>
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setExpanded(isOpen ? null : order.id)}
                              className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-red-400 hover:text-red-300"
                              data-testid={`toggle-items-${order.orderNumber}`}
                            >
                              <Package className="w-3.5 h-3.5" />
                              {order.items.length} {order.items.length === 1 ? "item" : "itens"}
                              {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          {/* Payment */}
                          <div className="flex lg:flex-col items-start gap-3 lg:gap-1.5 lg:min-w-[120px]">
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                              <CreditCard className="w-3 h-3" />
                              Pagamento
                            </span>
                            <div className="leading-tight">
                              <p className="text-xs font-bold text-white">{PaymentMethodLabel[order.paymentMethod]}</p>
                              {order.installments > 1 && (
                                <p className="text-[10px] text-neutral-500 font-bold">em {order.installments}x</p>
                              )}
                            </div>
                          </div>

                          {/* Total */}
                          <div className="flex lg:flex-col items-start gap-3 lg:gap-1 lg:min-w-[100px]">
                            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Total</span>
                            <p className="text-lg font-black bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent tabular-nums">{brl(order.total)}</p>
                          </div>

                          {/* Status & actions */}
                          <div className="flex flex-col items-stretch lg:items-end gap-2 lg:min-w-[220px]">
                            <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full w-fit ${cfg.bg} ${cfg.text} ring-1 ${cfg.ring}`}>
                              <StatusIcon className="w-3 h-3" />
                              {order.status}
                            </span>
                            <div className="flex flex-wrap gap-1 justify-start lg:justify-end">
                              {STATUSES.filter(s => s !== order.status).map(s => {
                                const c = statusConfig[s];
                                return (
                                  <button
                                    key={s}
                                    type="button"
                                    onClick={() => changeStatus(order.id, s)}
                                    title={`Marcar como ${s}`}
                                    className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full ring-1 ring-neutral-800 hover:ring-current ${c.text} hover:${c.bg} bg-neutral-900/60 transition-all`}
                                    data-testid={`set-status-${order.orderNumber}-${s}`}
                                  >
                                    <ArrowRight className="w-2.5 h-2.5" />
                                    {c.short}
                                  </button>
                                );
                              })}
                              <button
                                type="button"
                                onClick={() => deleteOrder(order.id)}
                                className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full ring-1 ring-neutral-800 hover:ring-red-600 text-neutral-500 hover:text-red-400 hover:bg-red-950/40 bg-neutral-900/60 transition-all"
                                title="Remover pedido"
                                data-testid={`delete-order-${order.orderNumber}`}
                              >
                                <Trash2 className="w-2.5 h-2.5" />
                                Excluir
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Expanded details */}
                        {isOpen && (
                          <div className="mt-5 pt-5 border-t border-neutral-900 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <p className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-red-400 mb-3">
                                <Package className="w-3 h-3" />
                                Itens
                              </p>
                              <ul className="space-y-2">
                                {order.items.map(it => (
                                  <li key={it.id} className="flex justify-between gap-3 text-xs bg-neutral-900/60 rounded-xl px-3 py-2.5 ring-1 ring-neutral-800">
                                    <span className="min-w-0">
                                      <strong className="text-red-400">{it.quantity}×</strong>{" "}
                                      <span className="text-white font-bold">{it.productName}</span>{" "}
                                      <span className="text-neutral-500">({it.brand})</span>
                                      {it.flavor && <span className="text-neutral-500"> — {it.flavor}</span>}
                                    </span>
                                    <span className="font-black text-white tabular-nums shrink-0">{brl(Number(it.unitPrice) * it.quantity)}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-red-400 mb-3">
                                <MapPin className="w-3 h-3" />
                                Endereço completo
                              </p>
                              <div className="bg-neutral-900/60 rounded-xl px-4 py-3 ring-1 ring-neutral-800 text-xs space-y-1 leading-relaxed">
                                <p className="text-white font-bold">{addr.firstName} {addr.lastName}</p>
                                <p className="text-neutral-300">{addr.street}, {addr.number}{addr.complement ? ` — ${addr.complement}` : ""}</p>
                                <p className="text-neutral-300">{addr.neighborhood} — {addr.city}/{addr.state}</p>
                                <p className="text-neutral-400">CEP {addr.cep}</p>
                                <p className="text-emerald-400 inline-flex items-center gap-1.5 mt-1">
                                  <Phone className="w-3 h-3" />
                                  {addr.phone}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </Fragment>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
