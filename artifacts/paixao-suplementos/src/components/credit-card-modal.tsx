import { useState } from "react";

export type CreditCardData = {
  cardNumber: string;
  cvv: string;
  expMonth: string;
  expYear: string;
  cardholder: string;
  cpf: string;
  installments: number;
};

type Props = {
  total: number;
  maxInstallments?: number;
  onClose: () => void;
  onConfirm: (data: CreditCardData) => void;
};

const MONTHS = ["01","02","03","04","05","06","07","08","09","10","11","12"];
const NOW_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 12 }, (_, i) => String(NOW_YEAR + i));

function brl(n: number) { return n.toFixed(2).replace(".", ","); }

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(\d{4})/g, "$1 ").trim();
}
function formatCpf(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  return d.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function CreditCardModal({ total, maxInstallments = 12, onClose, onConfirm }: Props) {
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cardholder, setCardholder] = useState("");
  const [cpf, setCpf] = useState("");
  const [installments, setInstallments] = useState(1);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cardNumber.replace(/\D/g, "").length < 13) return setError("Número do cartão inválido.");
    if (cvv.length < 3) return setError("CVV inválido.");
    if (!expMonth || !expYear) return setError("Informe a validade.");
    if (cardholder.trim().length < 3) return setError("Informe o nome do titular.");
    if (cpf.replace(/\D/g, "").length !== 11) return setError("CPF inválido.");
    setError("");
    onConfirm({ cardNumber, cvv, expMonth, expYear, cardholder, cpf, installments });
  }

  const inputClass = "w-full bg-neutral-50 border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-red-600 focus:bg-white transition-colors rounded placeholder:text-neutral-400";
  const labelClass = "block text-[11px] font-black uppercase tracking-widest text-neutral-600 mb-1";

  return (
    <div className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" data-testid="credit-card-modal">
      <div className="bg-white w-full max-w-xl shadow-2xl my-8">
        <header className="flex items-center justify-between bg-black text-white px-6 py-4 border-b-4 border-red-600">
          <div className="flex items-center gap-3">
            <span className="text-red-500 text-2xl">💳</span>
            <h3 className="font-black uppercase italic tracking-tight text-lg">Cartão de Crédito</h3>
          </div>
          <button type="button" onClick={onClose} className="h-8 w-8 bg-red-600 hover:bg-red-700 flex items-center justify-center" aria-label="Fechar">✕</button>
        </header>

        <div className="px-6 pt-4 pb-2">
          <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded p-3 text-xs">
            <span className="text-base leading-none">🔒</span>
            <span><strong className="font-black">Pagamento 100% seguro.</strong> Seus dados são criptografados em SSL e não são armazenados no nosso servidor.</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={labelClass}>Número do cartão *</label>
            <input className={inputClass} value={cardNumber} onChange={e => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="0000 0000 0000 0000" inputMode="numeric" autoComplete="cc-number" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>CVV *</label>
              <input className={inputClass} value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="123" inputMode="numeric" autoComplete="cc-csc" />
            </div>
            <div>
              <label className={labelClass}>Mês *</label>
              <select className={inputClass} value={expMonth} onChange={e => setExpMonth(e.target.value)}>
                <option value="">Mês</option>
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Ano *</label>
              <select className={inputClass} value={expYear} onChange={e => setExpYear(e.target.value)}>
                <option value="">Ano</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Nome do titular *</label>
            <input className={inputClass} value={cardholder} onChange={e => setCardholder(e.target.value.toUpperCase())}
              placeholder="Como aparece no cartão" autoComplete="cc-name" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>CPF do titular *</label>
              <input className={inputClass} value={cpf} onChange={e => setCpf(formatCpf(e.target.value))}
                placeholder="000.000.000-00" inputMode="numeric" />
            </div>
            <div>
              <label className={labelClass}>Parcelas</label>
              <select className={inputClass} value={installments} onChange={e => setInstallments(Number(e.target.value))}>
                {Array.from({ length: maxInstallments }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>{n}x de R$ {brl(total / n)}{n === 1 ? " sem juros" : ""}</option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="bg-red-50 border border-red-200 text-red-700 text-sm font-bold px-3 py-2 rounded">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-black uppercase tracking-wider py-3 text-sm rounded transition-colors">
              Cancelar
            </button>
            <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider py-3 text-sm rounded transition-colors">
              Confirmar cartão
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
