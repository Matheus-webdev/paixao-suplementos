import { useState } from "react";
import { useLocation } from "wouter";
import { Sun, Moon, Lightbulb, ShoppingCart, X, MessageCircle } from "lucide-react";
import { Product, products } from "../data/products";
import { ProductCard } from "./product-card";
import { getWhatsappUrl } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { useProducts } from "@/hooks/use-products";

type SvgArt = (props: { className?: string }) => React.ReactElement;

const BicepArt: SvgArt = ({ className }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {/* Dumbbell */}
    <rect x="3" y="13" width="3" height="6" rx="0.8" fill="currentColor" stroke="none" />
    <rect x="26" y="13" width="3" height="6" rx="0.8" fill="currentColor" stroke="none" />
    <rect x="6" y="14.5" width="2" height="3" rx="0.6" fill="currentColor" stroke="none" />
    <rect x="24" y="14.5" width="2" height="3" rx="0.6" fill="currentColor" stroke="none" />
    <rect x="8" y="15.2" width="16" height="1.6" rx="0.6" fill="currentColor" stroke="none" />
    {/* Energy bolts */}
    <path d="M11 6l-2 4h2.5L10 14" />
    <path d="M22 6l-2 4h2.5L21 14" />
  </svg>
);

const FlaskArt: SvgArt = ({ className }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4h8" />
    <path d="M13 4v7l-6 11c-1.2 2 0 4 2 4h14c2 0 3.2-2 2-4l-6-11V4" />
    <path d="M9 19h14" />
    <circle cx="13" cy="22" r="1" fill="currentColor" stroke="none" />
    <circle cx="18" cy="24" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="15" cy="26" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

const DiamondArt: SvgArt = ({ className }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 12l4-6h8l4 6-8 14L8 12z" />
    <path d="M8 12h16" />
    <path d="M12 6l4 6 4-6" />
    <path d="M12 12l4 14 4-14" />
    <path d="M27 5l1 1M28 8l1 0M25 4l0 -1" opacity="0.9" />
  </svg>
);

const ShieldArt: SvgArt = ({ className }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4l10 4v8c0 6-4 10-10 12-6-2-10-6-10-12V8l10-4z" />
    <path d="M16 12v6" />
    <circle cx="16" cy="22" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

const TargetArt: SvgArt = ({ className }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="14" cy="18" r="10" />
    <circle cx="14" cy="18" r="6" />
    <circle cx="14" cy="18" r="2.2" fill="currentColor" stroke="none" />
    <path d="M22 10l4-4" />
    <path d="M26 6l1.5-0.5-0.5 1.5L26 6z" fill="currentColor" />
    <path d="M22 10l-1 -3 3 1" />
  </svg>
);

function ProductDetailModal({
  product,
  onClose,
  dark,
}: {
  product: Product;
  onClose: () => void;
  dark: boolean;
}) {
  const [selectedFlavor, setSelectedFlavor] = useState(product.flavors?.[0] ?? "");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { bySlug } = useProducts();

  const whatsappUrl = getWhatsappUrl(
    `Olá! Tenho interesse no produto ${product.name} da marca ${product.brand}.${selectedFlavor ? ` Sabor escolhido: ${selectedFlavor}.` : ""} Pode me passar mais informações?`,
  );

  async function handleAddToCart() {
    if (!user) { onClose(); navigate("/login"); return; }
    const dbProduct = bySlug[product.id];
    if (!dbProduct) { setAddError("Produto indisponível no momento."); return; }
    setAdding(true); setAddError("");
    try {
      await addItem(dbProduct.id, selectedFlavor || null, 1);
      onClose();
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Erro ao adicionar ao carrinho.");
    } finally {
      setAdding(false);
    }
  }
  const detailGroups: { title: string; items?: string[]; icon: SvgArt; solid: string; shadow: string; ring: string }[] = [
    { title: "Benefícios", items: product.benefits, icon: BicepArt, solid: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-500/40", ring: "ring-emerald-400/40" },
    { title: "Informações nutricionais", items: product.nutrition, icon: FlaskArt, solid: "from-sky-500 to-sky-600", shadow: "shadow-sky-500/40", ring: "ring-sky-400/40" },
    { title: "Detalhes", items: product.highlights, icon: DiamondArt, solid: "from-amber-500 to-orange-500", shadow: "shadow-amber-500/40", ring: "ring-amber-400/40" },
    { title: "Importante", items: product.important, icon: ShieldArt, solid: "from-orange-500 to-red-500", shadow: "shadow-orange-500/40", ring: "ring-orange-400/40" },
    { title: "Indicado para", items: product.indicatedFor, icon: TargetArt, solid: "from-red-500 to-red-700", shadow: "shadow-red-500/40", ring: "ring-red-400/40" },
  ].filter((g) => g.items && g.items.length > 0);

  const modalBg = dark ? "bg-neutral-950 text-white" : "bg-white text-neutral-950";
  const borderClass = dark ? "border-neutral-800" : "border-neutral-200";
  const imgBg = dark ? "bg-neutral-900" : "bg-neutral-50";
  const infoBg = dark ? "bg-neutral-900" : "bg-neutral-50";
  const textSecondary = dark ? "text-neutral-400" : "text-neutral-600";

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm p-4 overflow-y-auto" data-testid="modal-product-detail">
      <div className="min-h-full flex items-center justify-center">
        <div className={`relative w-full max-w-6xl shadow-2xl border ${modalBg} ${borderClass}`}>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className={`group absolute right-4 top-4 z-20 h-10 w-10 rounded-full hover:bg-red-600 hover:text-white hover:ring-red-600 backdrop-blur-md ring-1 shadow-lg transition-all flex items-center justify-center ${
              dark
                ? "bg-white/10 text-white ring-white/20"
                : "bg-neutral-900/90 text-white ring-neutral-700"
            }`}
            data-testid="button-close-product"
          >
            <X className="w-5 h-5 transition-transform group-hover:rotate-90" strokeWidth={2.5} />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr]">
            <div className={`${imgBg} p-8 lg:p-12 flex items-center justify-center min-h-[340px]`}>
              <img
                src={product.image}
                alt={product.name}
                className="max-h-[480px] w-full object-contain"
                data-testid={`img-detail-${product.id}`}
              />
            </div>

            <div className="p-6 md:p-10 lg:p-12 max-h-[88vh] overflow-y-auto">
              <div className="inline-flex items-center gap-2 mb-5">
                <span className="bg-black text-white px-3 py-1 text-xs font-black uppercase tracking-widest">{product.brand}</span>
                <span className="bg-red-600 text-white px-3 py-1 text-xs font-black uppercase tracking-widest">{product.category}</span>
              </div>
              <h3
                className="text-3xl md:text-4xl font-black uppercase italic tracking-tight leading-none mb-3"
                data-testid={`text-detail-title-${product.id}`}
              >
                {product.title}
              </h3>
              <p className={`text-base mb-6 leading-relaxed ${textSecondary}`} data-testid={`text-detail-description-${product.id}`}>
                {product.description}
              </p>

              <div className="grid grid-cols-3 gap-3 mb-7">
                {/* Preço — destaque com gradiente vermelho */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-600 to-red-700 text-white p-4 shadow-lg shadow-red-600/30 ring-1 ring-red-400/40">
                  <span className="pointer-events-none absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/10 blur-xl" aria-hidden="true" />
                  <span
                    className="pointer-events-none absolute inset-0 opacity-[0.08]"
                    style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 8px)" }}
                    aria-hidden="true"
                  />
                  <div className="relative">
                    <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-red-100/90 mb-1">Preço</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[11px] font-black opacity-80">R$</span>
                      <strong className="text-2xl font-black leading-none tracking-tight">{product.price.toFixed(2).replace(".", ",")}</strong>
                    </div>
                  </div>
                </div>

                {/* Peso */}
                <div className={`relative overflow-hidden rounded-xl ${dark ? "bg-neutral-900 ring-neutral-800" : "bg-white ring-neutral-200"} ring-1 p-4 transition-all hover:ring-red-600/40 hover:shadow-md`}>
                  <span className={`block text-[10px] font-black uppercase tracking-[0.18em] ${textSecondary} mb-1`}>Peso</span>
                  <div className="flex items-baseline gap-1">
                    <strong className="text-2xl font-black leading-none tracking-tight">{product.weight.replace(/[a-zA-Z]/g, "")}</strong>
                    <span className="text-xs font-black opacity-60 uppercase">{product.weight.replace(/[0-9]/g, "")}</span>
                  </div>
                </div>

                {/* Tipo */}
                <div className={`relative overflow-hidden rounded-xl ${dark ? "bg-neutral-900 ring-neutral-800" : "bg-white ring-neutral-200"} ring-1 p-4 transition-all hover:ring-red-600/40 hover:shadow-md`}>
                  <span className={`block text-[10px] font-black uppercase tracking-[0.18em] ${textSecondary} mb-1`}>Tipo</span>
                  <strong className="text-[11px] font-black uppercase leading-tight block tracking-wide">{product.type}</strong>
                </div>
              </div>

              {product.flavors && product.flavors.length > 0 && (
                <div className="mb-7" data-testid={`flavors-${product.id}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-black uppercase tracking-[0.15em] text-xs flex items-center gap-2">
                      <span className="w-1 h-4 bg-red-600 rounded-sm" />
                      Escolha o sabor
                    </h4>
                    {selectedFlavor && (
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${dark ? "bg-red-600/15 text-red-400 ring-1 ring-red-600/30" : "bg-red-50 text-red-700 ring-1 ring-red-200"}`}>
                        {selectedFlavor}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.flavors.map((flavor) => {
                      const active = selectedFlavor === flavor;
                      return (
                        <button
                          key={flavor}
                          type="button"
                          onClick={() => setSelectedFlavor(flavor)}
                          className={`group relative px-4 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all overflow-hidden ${
                            active
                              ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/40 ring-1 ring-red-400/40 -translate-y-0.5"
                              : dark
                              ? "bg-neutral-900 ring-1 ring-neutral-700 text-neutral-300 hover:ring-red-600/60 hover:text-white hover:-translate-y-0.5"
                              : "bg-white ring-1 ring-neutral-200 text-neutral-700 hover:ring-red-600/60 hover:text-red-700 hover:-translate-y-0.5 hover:shadow-md"
                          }`}
                          data-testid={`button-flavor-${product.id}-${flavor.toLowerCase().replaceAll(" ", "-")}`}
                        >
                          {active && (
                            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                          )}
                          <span className="relative inline-flex items-center gap-1.5">
                            {active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            {flavor}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-3 mb-7">
                {product.longDescription.map((p) => (
                  <p key={p} className={`text-sm leading-relaxed ${textSecondary}`}>
                    {p}
                  </p>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-7">
                {detailGroups.map((group) => {
                  const Icon = group.icon;
                  return (
                    <div
                      key={group.title}
                      className={`relative overflow-hidden rounded-lg border ${borderClass} ${infoBg} p-5 transition-all hover:border-red-600/50 hover:shadow-lg ${dark ? "hover:shadow-red-600/5" : "hover:shadow-red-600/10"}`}
                    >
                      <span className="pointer-events-none absolute -top-12 -right-12 w-32 h-32 rounded-full bg-red-600/5 blur-2xl" aria-hidden="true" />
                      <div className="relative flex items-center gap-3 mb-4 pb-3 border-b border-dashed border-current/10">
                        <span className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${group.solid} text-white shadow-lg ${group.shadow} ring-1 ${group.ring}`}>
                          <Icon className="w-6 h-6" />
                        </span>
                        <h4 className="font-black uppercase tracking-[0.15em] text-xs">{group.title}</h4>
                      </div>
                      <ul className="relative space-y-2.5">
                        {group.items?.map((item) => (
                          <li key={item} className={`text-xs flex gap-2.5 leading-relaxed ${textSecondary}`}>
                            <span className="mt-[5px] flex-shrink-0 w-1.5 h-1.5 rounded-sm bg-gradient-to-br from-red-500 to-red-700" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              <div className={`relative overflow-hidden rounded-lg ${dark ? "bg-gradient-to-br from-red-950/40 via-neutral-900 to-neutral-900 border border-red-900/40" : "bg-gradient-to-br from-red-50 via-white to-white border border-red-200"} p-5 mb-7`}>
                <span className="pointer-events-none absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-500 via-red-600 to-red-700" aria-hidden="true" />
                <span className="pointer-events-none absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-red-600/10 blur-3xl" aria-hidden="true" />
                <div className="relative flex items-start gap-4 pl-3">
                  <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 ${dark ? "bg-red-600" : "bg-red-600"} text-white shadow-lg shadow-red-600/30`}>
                    <Lightbulb className="w-5 h-5" strokeWidth={2.25} fill="currentColor" fillOpacity={0.15} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black uppercase tracking-[0.18em] text-xs mb-1.5">Modo de uso</h4>
                    <p className={`text-sm leading-relaxed ${textSecondary}`}>{product.usage}</p>
                  </div>
                </div>
              </div>

              {addError && (
                <p className="bg-red-50 border border-red-200 text-red-700 text-sm font-bold px-3 py-2 rounded mb-3">{addError}</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="group relative inline-flex items-center justify-center gap-2.5 w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-60 text-white font-black uppercase tracking-wider py-4 rounded transition-all shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:-translate-y-0.5 disabled:translate-y-0"
                  data-testid={`button-add-cart-${product.id}`}
                >
                  <ShoppingCart className="w-5 h-5 transition-transform group-hover:scale-110" strokeWidth={2.5} />
                  <span>{adding ? "Adicionando..." : "Adicionar ao carrinho"}</span>
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`group relative inline-flex items-center justify-center gap-2.5 w-full font-black uppercase tracking-wider py-4 rounded transition-all shadow-lg hover:-translate-y-0.5 ${dark ? "bg-neutral-800 hover:bg-neutral-700 text-white shadow-black/40" : "bg-black hover:bg-neutral-800 text-white shadow-black/30"}`}
                  data-testid={`button-whatsapp-${product.id}`}
                >
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#25d366] text-white">
                    <MessageCircle className="w-3.5 h-3.5" strokeWidth={2.5} fill="currentColor" />
                  </span>
                  <span>Falar no WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const categoryBanners = [
  { label: "Whey Protein", value: "Whey Protein", desc: "Ganho muscular e recuperação" },
  { label: "Pré-Treino", value: "Pré-treino", desc: "Energia, foco e performance" },
  { label: "Creatina", value: "Creatina", desc: "Força, explosão e volume" },
  { label: "Hipercalóricos", value: "Hipercalóricos", desc: "Ganho de peso e massa" },
];

export function Catalog() {
  const [filter, setFilter] = useState<string>("Todos");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dark, setDark] = useState(false);

  const categories = ["Todos", "Whey Protein", "Creatina", "Pré-treino", "Hipercalóricos"];

  const filteredProducts =
    filter === "Todos" ? products : products.filter((p) => p.category === filter);

  const sectionBg = dark ? "bg-neutral-950" : "bg-neutral-100";
  const headerBg = dark ? "bg-black" : "bg-white";
  const textPrimary = dark ? "text-white" : "text-neutral-900";
  const textSecondary = dark ? "text-neutral-400" : "text-neutral-500";
  const filterActive = "bg-red-600 text-white border-red-600";
  const filterInactive = dark
    ? "bg-neutral-900 text-neutral-300 border-neutral-700 hover:border-red-600 hover:text-red-500"
    : "bg-white text-neutral-600 border-neutral-200 hover:border-red-600 hover:text-red-600";
  const bannerBg = dark ? "bg-neutral-900 border-neutral-800 hover:border-red-600" : "bg-white border-neutral-200 hover:border-red-600";

  return (
    <>
      <section id="produtos" className={`${sectionBg} transition-colors duration-300`} data-testid="section-catalog">
        <div className={`${headerBg} border-b ${dark ? "border-neutral-800" : "border-neutral-200"} transition-colors duration-300`}>
          <div className="container mx-auto px-4 py-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h2 className={`text-4xl md:text-5xl font-black uppercase italic tracking-tight ${textPrimary}`}>
                  Nossos <span className="text-red-600">Produtos</span>
                </h2>
                <p className={`mt-3 text-sm max-w-lg ${textSecondary}`}>
                  Clique em um produto para ver detalhes, escolher sabor e ir ao checkout.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDark(!dark)}
                aria-label={dark ? "Ativar modo claro" : "Ativar modo escuro"}
                className={`group relative inline-flex items-center gap-1 p-1 rounded-full border-2 font-black uppercase tracking-wider text-xs transition-all overflow-hidden ${
                  dark
                    ? "border-red-600/40 bg-neutral-900 text-neutral-200 shadow-lg shadow-red-600/10"
                    : "border-neutral-200 bg-white text-neutral-700 shadow-sm hover:border-red-600/40"
                }`}
                data-testid="button-dark-toggle"
              >
                <span
                  aria-hidden="true"
                  className={`absolute top-1 bottom-1 w-9 rounded-full bg-gradient-to-br transition-all duration-300 ease-out ${
                    dark
                      ? "left-[calc(100%-2.5rem)] from-red-600 to-red-700 shadow-md shadow-red-600/40"
                      : "left-1 from-amber-400 to-orange-500 shadow-md shadow-orange-400/40"
                  }`}
                />
                <span className="relative z-10 inline-flex items-center justify-center w-9 h-9">
                  {dark ? (
                    <Moon className="w-4 h-4 text-white" strokeWidth={2.5} fill="currentColor" />
                  ) : (
                    <Sun className="w-4 h-4 text-white" strokeWidth={2.5} />
                  )}
                </span>
                <span className="relative z-10 pr-4 pl-1">
                  {dark ? "Modo Escuro" : "Modo Claro"}
                </span>
              </button>
            </div>

            <div id="categorias" />
          </div>
        </div>

        {filter === "Todos" && (
          <div className="container mx-auto px-4 pt-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {categoryBanners.map((banner) => (
                <button
                  key={banner.value}
                  type="button"
                  onClick={() => setFilter(banner.value)}
                  className={`group relative overflow-hidden border-2 rounded-lg p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${bannerBg}`}
                  data-testid={`btn-category-banner-${banner.value}`}
                >
                  <div className="absolute bottom-0 right-0 w-16 h-16 bg-red-600/10 rounded-tl-full group-hover:scale-150 group-hover:bg-red-600/20 transition-all duration-500" />
                  <div className="w-2 h-6 bg-red-600 mb-3" />
                  <h3 className={`font-black uppercase text-sm tracking-wide ${textPrimary}`}>{banner.label}</h3>
                  <p className={`text-xs mt-1 ${textSecondary}`}>{banner.desc}</p>
                  <span className="inline-block mt-3 text-red-600 text-xs font-black uppercase tracking-wider group-hover:underline">
                    Ver produtos →
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 pb-16 pt-4">
          {filter !== "Todos" && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
              <button
                type="button"
                onClick={() => setFilter("Todos")}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider text-xs px-4 py-2.5 rounded transition-colors w-fit shadow-md"
                data-testid="btn-back-all-products"
              >
                <span className="text-base leading-none">←</span>
                Voltar para todos os produtos
              </button>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-8 bg-red-600 rounded-full" />
                <h3 className={`font-black uppercase text-xl tracking-tight ${textPrimary}`}>{filter}</h3>
                <span className={`text-sm font-bold ${textSecondary}`}>({filteredProducts.length} produtos)</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, i) => (
              <ProductCard key={`${filter}-${product.id}`} product={product} onSelect={setSelectedProduct} dark={dark} index={i} />
            ))}
          </div>
        </div>
      </section>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          dark={dark}
        />
      )}
    </>
  );
}
