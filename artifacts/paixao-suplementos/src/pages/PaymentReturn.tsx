import { Link } from "wouter";
import { Navbar } from "@/components/navbar";
import logo from "@/assets/logo.png";

type Status = "sucesso" | "falha" | "pendente";

function HourglassIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-12 h-12" aria-hidden="true">
      <path d="M16 6h32v2H16zM16 56h32v2H16z" fill="#1f1f1f" />
      <path d="M18 8h28v6c0 8-10 12-10 18s10 10 10 18v6H18v-6c0-8 10-10 10-18s-10-10-10-18V8z"
        fill="#fff7d6" stroke="#1f1f1f" strokeWidth="2" strokeLinejoin="round" />
      <path d="M22 12h20v3c0 6-10 9-10 17h0c0-8-10-11-10-17v-3z" fill="#dc2626" />
      <circle cx="32" cy="36" r="2.5" fill="#dc2626" />
      <path d="M22 52c0-5 4-8 10-8s10 3 10 8H22z" fill="#dc2626" />
    </svg>
  );
}

const COPY: Record<Status, { badge: string; title: string; subtitle: string; cta: string; color: string; icon: React.ReactNode }> = {
  sucesso: {
    badge: "PAGAMENTO APROVADO",
    title: "Recebemos seu pagamento!",
    subtitle: "Seu pedido já está sendo preparado. Em breve a gente entra em contato pelo WhatsApp com a previsão de entrega.",
    cta: "Ver meus pedidos",
    color: "bg-green-600",
    icon: <span className="text-4xl font-black">✓</span>,
  },
  pendente: {
    badge: "PAGAMENTO PENDENTE",
    title: "Estamos aguardando a confirmação",
    subtitle: "O Mercado Pago ainda não confirmou seu pagamento. Assim que rolar, atualizamos seu pedido automaticamente.",
    cta: "Acompanhar pedido",
    color: "bg-neutral-900",
    icon: <HourglassIcon />,
  },
  falha: {
    badge: "PAGAMENTO NÃO APROVADO",
    title: "Não conseguimos concluir o pagamento",
    subtitle: "Algo deu errado no processamento. Você pode tentar de novo escolhendo outro meio de pagamento.",
    cta: "Tentar novamente",
    color: "bg-red-600",
    icon: <span className="text-4xl font-black">✕</span>,
  },
};

export function PaymentReturn({ status }: { status: Status }) {
  const c = COPY[status];
  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-950 flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="bg-white border border-neutral-200 shadow-xl rounded-lg max-w-xl w-full overflow-hidden">
          <div className={`${c.color} relative text-white px-8 py-10 text-center overflow-hidden`}>
            <img
              src={logo}
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute inset-0 m-auto w-[85%] max-w-[420px] opacity-10 object-contain"
            />
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-white/25 flex items-center justify-center mx-auto mb-4">
                {c.icon}
              </div>
              <span className="inline-block bg-black/30 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded">{c.badge}</span>
              <h1 className="text-3xl font-black uppercase italic tracking-tight mt-4">{c.title}</h1>
            </div>
          </div>
          <div className="p-8 text-center space-y-6">
            <p className="text-neutral-600 text-sm leading-relaxed">{c.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/meus-pedidos" className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider px-6 py-3 text-sm rounded transition-colors">
                {c.cta}
              </Link>
              <Link href="/" className="bg-white border-2 border-neutral-200 hover:border-red-600 text-neutral-700 hover:text-red-600 font-black uppercase tracking-wider px-6 py-3 text-sm rounded transition-colors">
                Voltar à loja
              </Link>
            </div>
            <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-400 uppercase tracking-widest font-bold pt-4 border-t border-neutral-100">
              <img src={logo} alt="" className="h-6 w-auto opacity-60" />
              Paixão Suplementos
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PaymentReturn;
