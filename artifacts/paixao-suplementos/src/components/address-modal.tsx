import { useState } from "react";
import { MapPin, X, Search, AlertCircle, Save } from "lucide-react";
import { api, type ApiAddress } from "@/lib/api";

const BR_STATES = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

type Props = {
  onClose: () => void;
  onCreated: (addr: ApiAddress) => void;
};

export function AddressModal({ onClose, onCreated }: Props) {
  const [form, setForm] = useState({
    firstName: "", lastName: "", cep: "", street: "", number: "",
    neighborhood: "", complement: "", state: "MG", city: "", phone: "",
  });
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof typeof form>(k: K, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function lookupCep(rawCep: string) {
    const digits = rawCep.replace(/\D/g, "");
    if (digits.length !== 8) return;
    setCepLoading(true); setCepError("");
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (data.erro) {
        setCepError("CEP não encontrado.");
      } else {
        setForm(f => ({
          ...f,
          street: data.logradouro || f.street,
          neighborhood: data.bairro || f.neighborhood,
          city: data.localidade || f.city,
          state: data.uf || f.state,
        }));
      }
    } catch {
      setCepError("Não foi possível buscar o CEP. Preencha manualmente.");
    } finally {
      setCepLoading(false);
    }
  }

  function handleCepChange(value: string) {
    const cleaned = value.replace(/\D/g, "").slice(0, 8);
    const formatted = cleaned.length > 5 ? `${cleaned.slice(0, 5)}-${cleaned.slice(5)}` : cleaned;
    set("cep", formatted);
    if (cleaned.length === 8) lookupCep(cleaned);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const { address } = await api.post<{ address: ApiAddress }>("/addresses", form);
      onCreated(address);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar endereço.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full bg-neutral-50 border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-red-600 focus:bg-white focus:ring-2 focus:ring-red-600/15 transition-all rounded-lg placeholder:text-neutral-400";
  const labelClass = "block text-[11px] font-black uppercase tracking-widest text-neutral-600 mb-1.5";

  return (
    <div className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" data-testid="address-modal">
      <div className="bg-white w-full max-w-2xl shadow-2xl my-8 rounded-2xl overflow-hidden ring-1 ring-black/5" onClick={(e) => e.stopPropagation()}>
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
                <MapPin className="w-5 h-5" strokeWidth={2.5} />
              </span>
              <div>
                <h3 className="font-black uppercase italic tracking-tight text-lg leading-none">Adicionar Endereço</h3>
                <p className="text-[10px] text-neutral-400 mt-1.5 uppercase tracking-wider font-bold">Preencha os dados de entrega</p>
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

        <form onSubmit={handleSubmit} className="p-6 md:p-7 space-y-4 bg-gradient-to-b from-white to-neutral-50/40">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nome *</label>
              <input className={inputClass} value={form.firstName} onChange={e => set("firstName", e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>Sobrenome *</label>
              <input className={inputClass} value={form.lastName} onChange={e => set("lastName", e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-4">
            <div>
              <label className={labelClass}>CEP *</label>
              <div className="relative">
                <input className={inputClass} value={form.cep} onChange={e => handleCepChange(e.target.value)}
                  placeholder="00000-000" maxLength={9} inputMode="numeric" required />
                {cepLoading && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-[10px] text-red-600 font-black uppercase tracking-wider animate-pulse">
                    <Search className="w-3 h-3" strokeWidth={2.75} />
                    Buscando
                  </span>
                )}
              </div>
              {cepError && (
                <p className="inline-flex items-center gap-1 text-red-600 text-[11px] font-bold mt-1.5">
                  <AlertCircle className="w-3 h-3" strokeWidth={2.5} />
                  {cepError}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>Endereço *</label>
              <input className={inputClass} value={form.street} onChange={e => set("street", e.target.value)} placeholder="Rua, avenida..." required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr_1fr] gap-4">
            <div>
              <label className={labelClass}>Número *</label>
              <input className={inputClass} value={form.number} onChange={e => set("number", e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>Bairro *</label>
              <input className={inputClass} value={form.neighborhood} onChange={e => set("neighborhood", e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>Complemento</label>
              <input className={inputClass} value={form.complement} onChange={e => set("complement", e.target.value)} placeholder="Apto, bloco, casa..." />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4">
            <div>
              <label className={labelClass}>Estado *</label>
              <select className={inputClass} value={form.state} onChange={e => set("state", e.target.value)} required>
                {BR_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Cidade *</label>
              <input className={inputClass} value={form.city} onChange={e => set("city", e.target.value)} required />
            </div>
          </div>

          <div>
            <label className={labelClass}>Celular *</label>
            <input className={inputClass} value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="(31) 99999-9999" required />
          </div>

          {error && (
            <p className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm font-bold px-3.5 py-2.5 rounded-lg w-full">
              <AlertCircle className="w-4 h-4 flex-shrink-0" strokeWidth={2.5} />
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-3 border-t border-dashed border-neutral-200">
            <button type="button" onClick={onClose} className="flex-1 bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 font-black uppercase tracking-wider py-3 text-sm rounded-lg transition-colors">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="group flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-60 disabled:hover:translate-y-0 text-white font-black uppercase tracking-wider py-3 text-sm rounded-lg shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:-translate-y-0.5 transition-all"
            >
              <Save className="w-4 h-4" strokeWidth={2.5} />
              {saving ? "Salvando..." : "Salvar endereço"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
