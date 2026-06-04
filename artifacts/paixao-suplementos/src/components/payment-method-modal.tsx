import { useState } from "react";
import { CreditCard, X, Lock, ArrowRight, Zap } from "lucide-react";
import type { ApiOrder } from "@/lib/api";
import {
  VisaIcon,
  MastercardIcon,
  AmexIcon,
  DinersIcon,
  EloIcon,
  HipercardIcon,
  PixIcon,
} from "./card-brand-icons";

type Method = ApiOrder["paymentMethod"];

type Props = {
  initial?: Method | null;
  onClose: () => void;
  onSelect: (method: Method) => void;
};

type Option = {
  value: Method;
  title: string;
  subtitle: string;
  icons: React.ReactNode;
};

const OPTIONS: Option[] = [
  {
    value: "pix",
    title: "Pague via PIX",
    subtitle: "Aprovação instantânea",
    icons: <PixIcon />,
  },
  {
    value: "credito",
    title: "Cartão de Crédito",
    subtitle: "Em até 6x",
    icons: (
      <div className="flex items-center gap-1.5 flex-wrap justify-end">
        <VisaIcon />
        <MastercardIcon />
        <AmexIcon />
        <DinersIcon />
        <EloIcon />
        <HipercardIcon />
      </div>
    ),
  },
];

export function PaymentMethodModal({ initial = null, onClose, onSelect }: Props) {
  const [selected, setSelected] = useState<Method | null>(initial);

  return (
    <div className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" data-testid="payment-method-modal">
      <div className="bg-white w-full max-w-2xl shadow-2xl my-8 rounded-2xl overflow-hidden ring-1 ring-black/5">
        <header className="relative bg-gradient-to-br from-neutral-950 via-black to-neutral-900 text-white px-6 py-5 border-b-4 border-red-600 overflow-hidden">
          <span
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: "repeating-linear-gradient(45deg, #ef4444 0 1px, transparent 1px 14px)" }}
            aria-hidden="true"
          />
          <span className="pointer-events-none absolute -top-12 -right-12 w-44 h-44 rounded-full bg-red-600/30 blur-3xl" aria-hidden="true" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-red-600 shadow-lg shadow-red-600/40 ring-1 ring-red-400/40">
                <CreditCard className="w-5 h-5" strokeWidth={2.5} />
              </span>
              <div>
                <h3 className="font-black uppercase italic tracking-tight text-lg leading-none">Pagamento</h3>
                <p className="text-[10px] text-neutral-400 mt-1.5 uppercase tracking-wider font-bold inline-flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" strokeWidth={3} />
                  Ambiente seguro
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="group h-10 w-10 rounded-full bg-white/10 hover:bg-red-600 text-white ring-1 ring-white/20 hover:ring-red-600 backdrop-blur-md transition-all flex items-center justify-center"
            >
              <X className="w-5 h-5 transition-transform group-hover:rotate-90" strokeWidth={2.5} />
            </button>
          </div>
        </header>

        <div className="bg-gradient-to-b from-white to-neutral-50/40 p-5 md:p-6 space-y-3">
          <p className="text-[11px] font-black uppercase tracking-widest text-neutral-500 px-1">Escolha como pagar</p>

          {OPTIONS.map(opt => {
            const active = selected === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelected(opt.value)}
                className={`group relative w-full text-left rounded-xl px-4 py-4 flex items-center gap-4 transition-all overflow-hidden ${
                  active
                    ? "bg-gradient-to-br from-red-50 to-white ring-2 ring-red-600 shadow-lg shadow-red-600/10"
                    : "bg-white ring-1 ring-neutral-200 hover:ring-red-400 hover:shadow-md hover:-translate-y-0.5"
                }`}
                data-testid={`option-payment-${opt.value}`}
              >
                {active && (
                  <span className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full bg-red-600/10 blur-2xl" aria-hidden="true" />
                )}
                <span
                  className={`relative w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    active ? "border-red-600 bg-red-600 shadow-md shadow-red-600/40" : "border-neutral-300 group-hover:border-red-400"
                  }`}
                >
                  {active && <span className="w-2 h-2 rounded-full bg-white" />}
                </span>
                <div className="relative flex-1 min-w-0">
                  <p className="font-black uppercase text-sm tracking-wider text-neutral-900 leading-tight flex items-center gap-2">
                    {opt.title}
                    {opt.value === "pix" && (
                      <span className="inline-flex items-center gap-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full">
                        <Zap className="w-2.5 h-2.5" strokeWidth={3} />
                        Rápido
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">{opt.subtitle}</p>
                </div>
                <div className="relative flex-shrink-0">{opt.icons}</div>
              </button>
            );
          })}

          <div className="pt-4 mt-2 border-t border-dashed border-neutral-200 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-700 font-black uppercase tracking-wider py-3 text-sm rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={!selected}
              onClick={() => selected && onSelect(selected)}
              className="group flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:hover:translate-y-0 text-white font-black uppercase tracking-wider py-3 text-sm rounded-lg shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:-translate-y-0.5 transition-all"
            >
              Continuar
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
            </button>
          </div>

          <p className="inline-flex items-center justify-center gap-1.5 w-full text-[10px] text-neutral-500 uppercase tracking-wider font-bold pt-1">
            <Lock className="w-3 h-3 text-emerald-600" strokeWidth={2.5} />
            Pagamento processado pelo Mercado Pago
          </p>
        </div>
      </div>
    </div>
  );
}
