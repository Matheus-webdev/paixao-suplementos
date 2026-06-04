import { Link, useLocation } from "wouter";
import { Truck, Shield, Zap, ShoppingCart, Package, LogOut, MessageCircle, User, ArrowRight } from "lucide-react";
import logo from "@/assets/logo.png";
import { getWhatsappUrl } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";

export function Navbar() {
  const whatsappUrl = getWhatsappUrl("Olá! Vim pelo site Paixão Suplementos e gostaria de atendimento.");
  const { user, logout } = useAuth();
  const { open, itemCount } = useCart();
  const [, navigate] = useLocation();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-black border-b-2 border-red-600 text-white shadow-xl" data-testid="nav-main">
      <div className="relative bg-neutral-950 text-white border-b border-red-600/40 overflow-hidden" data-testid="banner-frete-gratis">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #ef4444 0 1px, transparent 1px 12px)",
          }}
          aria-hidden="true"
        />
        <div className="relative container mx-auto px-4 py-2 flex items-center justify-center gap-4 sm:gap-8 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em]">
          <span className="flex items-center gap-2">
            <span className="relative flex items-center justify-center w-6 h-6 rounded-full bg-red-600 ring-2 ring-red-600/30">
              <Truck className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </span>
            <span>
              Frete <span className="text-red-500">grátis</span>
              <span className="hidden sm:inline"> em todo o Brasil</span>
            </span>
          </span>

          <span className="hidden md:flex items-center gap-2 text-neutral-300">
            <Shield className="w-3.5 h-3.5 text-red-500" strokeWidth={2.5} />
            <span>Compra 100% segura</span>
          </span>

          <span className="hidden md:flex items-center gap-2 text-neutral-300">
            <Zap className="w-3.5 h-3.5 text-red-500" strokeWidth={2.5} />
            <span>Envio rápido</span>
          </span>
        </div>
      </div>
      <div className="container mx-auto px-4 h-32 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" data-testid="link-home">
          <img src={logo} alt="Paixão Suplementos" className="h-28 w-auto" />
        </Link>
        <div className="hidden md:flex items-center space-x-6 font-bold uppercase tracking-wider text-sm">
          <a href="#produtos" className="hover:text-red-500 transition-colors" data-testid="link-nav-produtos">Produtos</a>
          <a href="#categorias" className="hover:text-red-500 transition-colors" data-testid="link-nav-categorias">Categorias</a>
          <a href="#sobre" className="hover:text-red-500 transition-colors" data-testid="link-nav-sobre">Sobre</a>

          <button type="button" onClick={open} className="group relative inline-flex items-center gap-2 pl-3 pr-4 py-2 rounded-full bg-white/5 hover:bg-red-600 ring-1 ring-white/10 hover:ring-red-600 transition-all" data-testid="button-cart">
            <span className="relative inline-flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" strokeWidth={2.5} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-red-600 group-hover:bg-white text-white group-hover:text-red-600 text-[10px] font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center ring-2 ring-neutral-950 group-hover:ring-red-600 shadow-md transition-colors">
                  {itemCount}
                </span>
              )}
            </span>
            <span>Carrinho</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2.5">
              <Link
                href="/meus-pedidos"
                className="group inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-3 py-2 rounded-full bg-white/5 hover:bg-red-600 ring-1 ring-white/10 hover:ring-red-600 text-neutral-200 hover:text-white transition-all"
                data-testid="link-nav-pedidos"
              >
                <Package className="w-3.5 h-3.5" strokeWidth={2.5} />
                Meus Pedidos
              </Link>

              <div className="inline-flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-gradient-to-r from-white/5 to-transparent ring-1 ring-white/10">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-red-600 to-red-700 ring-1 ring-red-400/40 shadow-md shadow-red-600/30">
                  <span className="text-[11px] font-black text-white uppercase">
                    {user.name.charAt(0)}
                  </span>
                </span>
                <span className="text-[11px] text-neutral-400 font-bold normal-case tracking-normal pr-1">
                  Olá, <span className="text-white font-black">{user.name.split(" ")[0]}</span>
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                aria-label="Sair"
                className="group inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/5 hover:bg-red-600 ring-1 ring-white/10 hover:ring-red-600 text-neutral-300 hover:text-white transition-all"
              >
                <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="group inline-flex items-center gap-1.5 ring-1 ring-white/30 hover:ring-red-600 hover:bg-red-600 text-white px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all"
              data-testid="link-nav-login"
            >
              <User className="w-3.5 h-3.5" strokeWidth={2.5} />
              Entrar
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
            </Link>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:-translate-y-0.5 transition-all overflow-hidden"
            data-testid="link-nav-contato"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            <MessageCircle className="relative w-3.5 h-3.5" strokeWidth={2.75} />
            <span className="relative">Fale Conosco</span>
          </a>
        </div>

        <div className="flex md:hidden items-center gap-3">
          <button type="button" onClick={open} className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/5 ring-1 ring-white/10" aria-label="Carrinho">
            <ShoppingCart className="w-4 h-4" strokeWidth={2.5} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center ring-2 ring-neutral-950 shadow-md">
                {itemCount}
              </span>
            )}
          </button>
          {user ? (
            <>
              <Link href="/meus-pedidos" className="text-xs font-bold uppercase text-white hover:text-red-500">
                Pedidos
              </Link>
              <button type="button" onClick={handleLogout} className="text-xs font-bold uppercase text-neutral-400 hover:text-white">
                Sair
              </button>
            </>
          ) : (
            <Link href="/login" className="text-xs font-bold uppercase text-white hover:text-red-500">
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
