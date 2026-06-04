import { ArrowUpRight, Eye } from "lucide-react";
import { Product } from "../data/products";

export function ProductCard({
  product,
  onSelect,
  dark,
  index = 0,
}: {
  product: Product;
  onSelect: (product: Product) => void;
  dark?: boolean;
  index?: number;
}) {
  const cardBg = dark
    ? "bg-neutral-900 ring-neutral-800 hover:ring-red-600/60"
    : "bg-white ring-neutral-200 hover:ring-red-600/40";
  const textPrimary = dark ? "text-white" : "text-neutral-900";
  const textSecondary = dark ? "text-neutral-400" : "text-neutral-500";
  const textMuted = dark ? "text-neutral-500" : "text-neutral-400";
  const imgBg = dark
    ? "bg-gradient-to-br from-neutral-800 via-neutral-850 to-neutral-900"
    : "bg-gradient-to-br from-neutral-50 via-white to-neutral-100";
  const flavorChip = dark
    ? "bg-neutral-800/60 ring-neutral-700 text-neutral-300"
    : "bg-neutral-50 ring-neutral-200 text-neutral-600";
  const priceBg = dark ? "bg-neutral-800/40" : "bg-neutral-50";

  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className={`animate-card group relative rounded-2xl ring-1 overflow-hidden transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-red-600/10 hover:-translate-y-1 flex flex-col h-full text-left ${cardBg}`}
      style={{ animationDelay: `${index * 80}ms` }}
      data-testid={`card-product-${product.id}`}
    >
      {/* Image area */}
      <div className={`relative overflow-hidden ${imgBg}`} style={{ aspectRatio: "1" }}>
        {/* Decorative diagonal stripes */}
        <span
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, currentColor 0 1px, transparent 1px 12px)" }}
          aria-hidden="true"
        />
        {/* Red glow on hover */}
        <span className="pointer-events-none absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-red-600/0 group-hover:bg-red-600/15 blur-3xl transition-all duration-500" aria-hidden="true" />

        {/* Vignette overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <img
          src={product.image}
          alt={product.name}
          className="relative z-[5] w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500 drop-shadow-md"
          data-testid={`img-product-${product.id}`}
        />

        {/* Top-left badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
          <span className="inline-flex items-center bg-black/90 backdrop-blur-sm text-white text-[9px] font-black uppercase px-2.5 py-1 tracking-[0.2em] rounded-full ring-1 ring-white/10 shadow-lg">
            {product.brand}
          </span>
          <span className="inline-flex items-center bg-gradient-to-r from-red-600 to-red-700 text-white text-[9px] font-black uppercase px-2.5 py-1 tracking-[0.2em] rounded-full ring-1 ring-red-400/40 shadow-lg shadow-red-600/30">
            {product.category}
          </span>
        </div>

        {/* Top-right "view" hint icon */}
        <div className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/0 group-hover:bg-white/95 flex items-center justify-center transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100">
          <Eye className="w-4 h-4 text-red-600" strokeWidth={2.5} />
        </div>

        {/* Centered "Ver detalhes" pill on hover */}
        <div className="absolute inset-0 z-20 flex items-end justify-center pb-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0">
          <span className="inline-flex items-center gap-1.5 bg-white text-neutral-900 text-[10px] font-black uppercase tracking-[0.18em] px-4 py-2 rounded-full shadow-xl ring-1 ring-black/5">
            Ver detalhes
            <ArrowUpRight className="w-3 h-3" strokeWidth={3} />
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-grow">
        <h3
          className={`font-black text-base leading-tight mb-1.5 line-clamp-2 min-h-[2.5rem] tracking-tight ${textPrimary}`}
          data-testid={`text-product-name-${product.id}`}
        >
          {product.name}
        </h3>

        {/* Weight + type meta */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-[10px] font-black uppercase tracking-wider ${textSecondary}`}>{product.weight}</span>
          <span className={`w-1 h-1 rounded-full ${textMuted} bg-current`} />
          <span className={`text-[10px] font-black uppercase tracking-wider truncate ${textSecondary}`}>{product.type}</span>
        </div>

        <p
          className={`animate-desc text-sm mb-4 line-clamp-3 min-h-[3.75rem] leading-relaxed ${textSecondary}`}
          style={{ animationDelay: `${index * 80 + 120}ms` }}
        >
          {product.description}
        </p>

        {/* Flavor chips */}
        <div className="min-h-[28px] mb-4">
          {product.flavors && product.flavors.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {product.flavors.slice(0, 3).map((f) => (
                <span
                  key={f}
                  className={`text-[9px] px-2 py-0.5 rounded-full ring-1 font-black uppercase tracking-wider ${flavorChip}`}
                >
                  {f}
                </span>
              ))}
              {product.flavors.length > 3 && (
                <span className="text-[9px] px-2 py-0.5 rounded-full ring-1 ring-red-600/30 bg-red-600/10 text-red-600 font-black uppercase tracking-wider">
                  +{product.flavors.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price + CTA */}
        <div className="mt-auto space-y-3">
          <div className={`flex items-baseline justify-between rounded-xl px-3 py-2.5 ${priceBg}`}>
            <span className={`text-[9px] font-black uppercase tracking-[0.18em] ${textMuted}`}>A partir de</span>
            <div className="flex items-baseline gap-0.5">
              <span className={`text-xs font-black ${textSecondary}`}>R$</span>
              <span
                className={`text-2xl font-black tracking-tight ${textPrimary}`}
                data-testid={`text-product-price-${product.id}`}
              >
                {product.price.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>

          <div className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-black uppercase tracking-[0.18em] py-3 text-xs text-center shadow-lg shadow-red-600/30 ring-1 ring-red-400/40 transition-all group-hover:shadow-red-600/50">
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            <span className="relative inline-flex items-center justify-center gap-1.5">
              Ver detalhes
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={3} />
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
