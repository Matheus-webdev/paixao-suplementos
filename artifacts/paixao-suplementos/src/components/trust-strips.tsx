type IconKey = "shield" | "truck" | "message" | "card";

function Icon({ name }: { name: IconKey }) {
  const common = "w-7 h-7";
  switch (name) {
    case "shield":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2 4 5v7c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "truck":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 7h13v10H1zM14 10h4l3 3v4h-7z" />
          <circle cx="6" cy="18" r="2" />
          <circle cx="18" cy="18" r="2" />
        </svg>
      );
    case "message":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1-.9-3.8A8.38 8.38 0 0 1 12.5 3a8.38 8.38 0 0 1 8.5 8.5z" />
        </svg>
      );
    case "card":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20M6 15h4" />
        </svg>
      );
  }
}

export function TrustStrips() {
  const strips: { title: string; desc: string; icon: IconKey }[] = [
    { title: "Produtos Originais", desc: "Direto da fábrica, com nota fiscal", icon: "shield" },
    { title: "Envio Rápido",       desc: "Entregas em toda a região",       icon: "truck" },
    { title: "Atendimento",        desc: "Tira dúvidas no WhatsApp",        icon: "message" },
    { title: "Pagamento Seguro",   desc: "PIX, cartão ou boleto",           icon: "card" },
  ];

  return (
    <div className="bg-black border-y-2 border-red-600/30 text-white py-8" data-testid="section-trust">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {strips.map((strip, idx) => (
            <div key={idx} className="flex items-center gap-4 group">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white shadow-[0_0_20px_rgba(220,38,38,0.35)] group-hover:scale-110 transition-transform flex-shrink-0">
                <Icon name={strip.icon} />
              </div>
              <div className="min-w-0">
                <h4 className="font-black uppercase text-sm tracking-wider leading-tight">{strip.title}</h4>
                <p className="text-xs text-neutral-400 mt-0.5 leading-snug">{strip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
