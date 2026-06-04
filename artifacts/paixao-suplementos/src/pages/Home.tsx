import { Navbar } from "@/components/navbar";
import { TrustStrips } from "@/components/trust-strips";
import { Catalog } from "@/components/catalog";
import { getWhatsappUrl } from "@/lib/utils";
import { Quote, ShieldCheck, MessageCircle, TrendingUp, ArrowUpRight } from "lucide-react";

function FlameArt({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* Outer flame — solid white, sharp/stylized silhouette */}
      <path
        d="M13.2 2.2c.3 1.8-.4 3.1-1.4 4.4-1.3 1.7-3 3.4-3.6 5.6-.4 1.5-.2 3.1.6 4.4-.9-.3-1.7-1.1-2.1-2.1-.6 1.1-.9 2.4-.9 3.6 0 3.6 2.7 6.4 6.2 6.4 3.5 0 6.2-2.8 6.2-6.4 0-2.7-1.4-4.9-2.8-6.9-1.2-1.7-2.4-3.4-2.4-5.4 0-1.4.4-2.6 0.2-3.6z"
        fill="currentColor"
      />
      {/* Inner cutout — creates the iconic flame "tongue" using even-odd via overlay */}
      <path
        d="M12.5 11.5c.6 1.4 1.7 2.6 1.7 4.2 0 1.6-1.1 2.9-2.7 2.9-1.4 0-2.4-1-2.4-2.4 0-1.5 1-2.5 1.7-3.6.4-.6.5-1.4.3-2.1.5.3 1 .6 1.4 1z"
        fill="#dc2626"
      />
      {/* Bright highlight tip */}
      <ellipse cx="12.3" cy="17" rx="0.9" ry="1.4" fill="#fff" opacity="0.95" />
    </svg>
  );
}
import logo from "@/assets/logo.png";
import logoTransparent from "@/assets/logo-transparent.png";
import gymPhoto from "@assets/baixados_(4)_1776791756701.jpg";
import handshakePhoto from "@assets/baixados_(3)_1776791761673.jpg";
import growthPhoto from "@assets/Growth_1776791765563.jpg";

function Hero() {
  const whatsappUrl = getWhatsappUrl("Olá! Vim pelo site Paixão Suplementos e gostaria de ver os produtos disponíveis.");

  return (
    <div className="relative bg-black text-white min-h-[88vh] flex items-center overflow-hidden" data-testid="section-hero">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-black/5 z-10" />

      <img
        src={logo}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-[70%] top-1/2 -translate-x-1/2 -translate-y-1/2 h-[120%] w-auto object-contain opacity-100 select-none z-0"
      />

      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-3xl">
          <div className="inline-block bg-red-600 text-white font-black px-4 py-1.5 uppercase tracking-widest text-xs mb-8 rounded-sm">
            Energia que move resultados
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none mb-6">
            A Paixão que{" "}
            <span className="text-[#ff1a1a] [text-shadow:0_0_40px_rgba(255,30,30,0.7)]">move</span>{" "}
            seu treino.
          </h1>
          <p className="text-lg md:text-xl text-neutral-300 mb-10 max-w-xl leading-relaxed">
            Produtos Max Titanium e Probiótica com o melhor preço e procedência garantida. Chegou a hora de quebrar seus limites.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#produtos"
              className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider py-4 px-10 text-center rounded-sm transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] text-lg"
            >
              Ver Catálogo
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-black uppercase tracking-wider py-4 px-10 text-center rounded-sm transition-all text-lg"
              data-testid="link-hero-contact"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function About() {
  return (
    <section id="sobre" className="bg-gradient-to-b from-black via-neutral-950 to-black text-white py-28 border-t border-neutral-900 relative overflow-hidden" data-testid="section-sobre">
      {/* Decorative background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-red-600/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-red-600/5 blur-[100px] rounded-full pointer-events-none" />
      <span
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "repeating-linear-gradient(45deg, #ef4444 0 1px, transparent 1px 18px)" }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-5xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center bg-red-600 text-white font-black px-4 py-1.5 uppercase tracking-[0.2em] text-[10px] mb-5 rounded-full shadow-lg shadow-red-600/40">
              Nossa história
            </span>
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-[0.9] mb-5">
              A Paixão que <span className="inline-block pr-2 bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(220,38,38,0.4)]">começou no treino</span>
            </h2>
            <div className="flex items-center justify-center gap-2 mt-6">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-red-600" />
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-red-600" />
            </div>
          </div>

          {/* Story card */}
          <div className="relative bg-gradient-to-br from-neutral-900/80 to-black/80 border border-neutral-800 rounded-2xl p-8 md:p-14 mb-12 backdrop-blur-sm shadow-2xl">
            {/* Decorative quote mark */}
            <span className="absolute -top-6 left-8 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-600 shadow-lg shadow-red-600/40 ring-4 ring-black">
              <Quote className="w-6 h-6" strokeWidth={2.5} fill="currentColor" />
            </span>
            <span className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-3xl rounded-full pointer-events-none" />

            <div className="space-y-5 text-neutral-300 leading-relaxed text-base md:text-[17px] relative">
              <p>
                A <span className="text-white font-bold">Paixão Suplementos</span> nasceu da rotina de um jovem que vivia
                a academia de dentro pra fora. Treinando todo dia, ele percebeu uma coisa simples: era difícil achar
                suplementos de qualidade, com preço justo e um atendimento que realmente entendesse quem treina.
              </p>
              <p>
                A maioria das lojas tratava o cliente como mais um número. Ou cobrava caro demais, ou empurrava
                qualquer coisa só pra vender. Foi aí que veio a ideia:
              </p>

              {/* Pull quote */}
              <blockquote className="relative my-6 pl-6 py-2 border-l-4 border-red-600">
                <p className="text-xl md:text-2xl font-black italic uppercase tracking-tight text-white leading-tight">
                  "Por que não montar uma loja feita por quem treina, pra quem treina?"
                </p>
              </blockquote>

              <p>
                Com pouco capital e muita vontade, ele começou pequeno — vendendo Max Titanium e Probiótica direto
                pelo WhatsApp, atendendo amigos da academia e indicações. A confiança foi crescendo, os pedidos
                começaram a chegar e o que era um sonho virou um projeto sério.
              </p>
              <p>
                Hoje a Paixão Suplementos é uma loja recém-criada, mas que cresce a cada dia com o mesmo espírito do
                primeiro pedido: <span className="text-red-500 font-bold">produto original, preço honesto e
                atendimento de gente que treina junto com você.</span> Esse é só o começo da nossa caminhada — e a
                gente quer evoluir junto com cada cliente.
              </p>
            </div>
          </div>

          {/* Pillar cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: "01", title: "Produtos Originais", icon: ShieldCheck, photo: gymPhoto, alt: "Equipamentos de academia",
                desc: "Só trabalhamos com Max Titanium e Probiótica — marcas reconhecidas, com procedência garantida e nota fiscal." },
              { n: "02", title: "Atendimento Próximo", icon: MessageCircle, photo: handshakePhoto, alt: "Aperto de mãos representando atendimento próximo",
                desc: "WhatsApp direto com quem entende de treino. Tira dúvida, recomenda produto e fala como gente, sem robô." },
              { n: "03", title: "Crescendo Juntos", icon: TrendingUp, photo: growthPhoto, alt: "Gráfico de crescimento",
                desc: "Loja nova, com energia nova. A cada pedido a gente melhora — e quem chega cedo cresce junto com a marca." },
            ].map(({ n, title, icon: Icon, photo, alt, desc }) => (
              <div
                key={n}
                className="group relative bg-gradient-to-br from-neutral-950 to-neutral-900 border border-neutral-800 hover:border-red-600/60 p-6 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-600/10 overflow-hidden"
              >
                {/* Hover glow */}
                <span className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-red-600/0 group-hover:bg-red-600/10 blur-3xl transition-all duration-500" />

                {/* Number badge */}
                <span className="absolute top-5 right-5 text-[42px] font-black italic text-neutral-800 group-hover:text-red-600/30 leading-none transition-colors">
                  {n}
                </span>

                <div className="relative">
                  {/* Photo + icon overlay */}
                  <div className="relative w-20 h-20 mb-5">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-red-600/40 group-hover:ring-red-600 transition-all">
                      <img src={photo} alt={alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <span className="absolute -bottom-2 -right-2 inline-flex items-center justify-center w-9 h-9 rounded-xl bg-red-600 ring-4 ring-neutral-950 shadow-lg shadow-red-600/40">
                      <Icon className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </span>
                  </div>

                  <h3 className="font-black uppercase italic tracking-tight text-xl mb-2 leading-none">{title}</h3>
                  <div className="w-8 h-0.5 bg-red-600 mb-3 group-hover:w-16 transition-all duration-300" />
                  <p className="text-neutral-400 text-sm leading-relaxed">{desc}</p>
                </div>

                <ArrowUpRight
                  className="absolute bottom-5 right-5 w-4 h-4 text-neutral-700 group-hover:text-red-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
                  strokeWidth={2.5}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const whatsappUrl = getWhatsappUrl("Olá! Vim pelo site Paixão Suplementos e gostaria de solicitar atendimento.");

  return (
    <footer id="contato" className="bg-black text-white pt-16 pb-8 border-t-4 border-red-600" data-testid="footer">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <img src={logo} alt="Paixão Suplementos" className="h-20 w-auto mb-6" />
            <p className="text-neutral-400 text-sm leading-relaxed">
              Sua loja de suplementos de confiança. Trabalhamos apenas com produtos originais Max Titanium e Probiótica.
            </p>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-wider mb-6 text-base">Links Rápidos</h4>
            <ul className="space-y-3 text-neutral-400">
              <li><a href="#produtos" className="hover:text-red-500 transition-colors">Produtos</a></li>
              <li><a href="#categorias" className="hover:text-red-500 transition-colors">Categorias</a></li>
              <li><a href="#sobre" className="hover:text-red-500 transition-colors">Sobre</a></li>
              <li><a href="/admin/login" className="hover:text-red-500 transition-colors">Área do Admin</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-wider mb-6 text-base">Atendimento</h4>
            <ul className="space-y-3 text-neutral-400 text-sm">
              <li>Segunda a Sexta: 08h às 18h</li>
              <li>Sábado: 08h às 12h</li>
              <li>Envios para toda a região</li>
            </ul>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-sm transition-colors uppercase tracking-wider text-sm"
              data-testid="link-footer-contact"
            >
              Chamar no WhatsApp
            </a>
          </div>
        </div>
        <div className="text-center text-neutral-600 text-sm border-t border-neutral-800 pt-8">
          <p>&copy; {new Date().getFullYear()} Paixão Suplementos. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <TrustStrips />
      <Catalog />
      <About />
      <Footer />
    </div>
  );
}
