import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Mail, Lock, User as UserIcon, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/contexts/auth-context";

/* ---------- Custom SVG art ---------- */
function HeroArt({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 320 320" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#dc2626" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#dc2626" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dbMetal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fafafa" />
          <stop offset="50%" stopColor="#a3a3a3" />
          <stop offset="100%" stopColor="#404040" />
        </linearGradient>
        <linearGradient id="dbBar" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#525252" />
          <stop offset="100%" stopColor="#171717" />
        </linearGradient>
        <linearGradient id="boltGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
      </defs>

      {/* Outer red glow */}
      <circle cx="160" cy="160" r="140" fill="url(#heroGlow)" />

      {/* Concentric rings */}
      <circle cx="160" cy="160" r="118" stroke="#dc2626" strokeOpacity="0.18" strokeWidth="1" strokeDasharray="2 6" />
      <circle cx="160" cy="160" r="92" stroke="#dc2626" strokeOpacity="0.25" strokeWidth="1" />
      <circle cx="160" cy="160" r="60" stroke="#fff" strokeOpacity="0.08" strokeWidth="1" />

      {/* Energy bolt behind dumbbell */}
      <path
        d="M178 60 L138 158 L172 158 L142 260 L210 142 L176 142 Z"
        fill="url(#boltGrad)"
        opacity="0.22"
      />

      {/* Dumbbell — central composition */}
      <g transform="translate(160 160) rotate(-18)">
        {/* Bar */}
        <rect x="-72" y="-8" width="144" height="16" rx="3" fill="url(#dbBar)" />
        {/* Bar grip lines */}
        {[-22, -10, 2, 14].map((x) => (
          <line key={x} x1={x} y1="-6" x2={x} y2="6" stroke="#262626" strokeWidth="1" />
        ))}
        {/* Sleeves */}
        <rect x="-86" y="-12" width="14" height="24" rx="2" fill="#262626" />
        <rect x="72" y="-12" width="14" height="24" rx="2" fill="#262626" />
        {/* Plates left */}
        <rect x="-104" y="-30" width="14" height="60" rx="3" fill="url(#dbMetal)" stroke="#171717" strokeWidth="1" />
        <rect x="-122" y="-42" width="16" height="84" rx="3" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1" />
        <rect x="-142" y="-50" width="18" height="100" rx="3" fill="#171717" stroke="#404040" strokeWidth="1" />
        {/* Plate highlights left */}
        <rect x="-141" y="-49" width="3" height="100" fill="#fff" opacity="0.15" />
        {/* Plates right (mirror) */}
        <rect x="90" y="-30" width="14" height="60" rx="3" fill="url(#dbMetal)" stroke="#171717" strokeWidth="1" />
        <rect x="106" y="-42" width="16" height="84" rx="3" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1" />
        <rect x="124" y="-50" width="18" height="100" rx="3" fill="#171717" stroke="#404040" strokeWidth="1" />
        <rect x="125" y="-49" width="3" height="100" fill="#fff" opacity="0.15" />
      </g>

      {/* Floating sparks */}
      <circle cx="78" cy="78" r="2.5" fill="#fde68a" opacity="0.9" />
      <circle cx="252" cy="92" r="1.8" fill="#fff" opacity="0.7" />
      <circle cx="68" cy="232" r="2" fill="#fca5a5" opacity="0.8" />
      <circle cx="248" cy="240" r="2.5" fill="#fff" opacity="0.6" />
      <circle cx="160" cy="42" r="1.8" fill="#fde68a" opacity="0.85" />

      {/* Tiny crosses (sparkles) */}
      <g stroke="#fff" strokeWidth="1.2" opacity="0.6">
        <line x1="44" y1="160" x2="52" y2="160" />
        <line x1="48" y1="156" x2="48" y2="164" />
        <line x1="268" y1="170" x2="276" y2="170" />
        <line x1="272" y1="166" x2="272" y2="174" />
      </g>
    </svg>
  );
}

/* Monochrome line-art icons — single red stroke matching site language */
function ShieldStarArt({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3 L20 6 V12 C20 17 16.5 20.5 12 22 C7.5 20.5 4 17 4 12 V6 Z" fill="currentColor" fillOpacity="0.08" />
      <path d="M9.5 12 L11.5 14 L15 10" />
    </svg>
  );
}

function TruckArt({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="11" height="10" rx="1" fill="currentColor" fillOpacity="0.08" />
      <path d="M13 10 H17 L20 13 V17 H13 Z" fill="currentColor" fillOpacity="0.08" />
      <circle cx="7" cy="18.5" r="1.6" fill="currentColor" fillOpacity="0.15" />
      <circle cx="16.5" cy="18.5" r="1.6" fill="currentColor" fillOpacity="0.15" />
    </svg>
  );
}

function TagArt({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12 L12 3 H20 V11 L11 20 Z" fill="currentColor" fillOpacity="0.08" />
      <circle cx="16" cy="8" r="1.3" fill="currentColor" />
      <line x1="9" y1="15" x2="15" y2="9" strokeWidth="1.5" />
      <circle cx="9.5" cy="14.5" r="0.9" fill="none" strokeWidth="1.3" />
      <circle cx="14.5" cy="9.5" r="0.9" fill="none" strokeWidth="1.3" />
    </svg>
  );
}

function FlashArt({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2 L5 13 H11 L10 22 L19 11 H13 Z" fill="currentColor" fillOpacity="0.12" />
    </svg>
  );
}

type Tab = "login" | "register";

export default function Login() {
  const [, navigate] = useLocation();
  const { login, register } = useAuth();

  const [tab, setTab] = useState<Tab>("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    if (!loginEmail || !loginPassword) { setLoginError("Preencha todos os campos."); return; }
    setLoginLoading(true);
    try {
      const u = await login(loginEmail, loginPassword);
      navigate(u.role === "admin" ? "/admin/dashboard" : "/");
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Erro ao entrar.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegError("");
    if (!regName || !regEmail || !regPassword || !regConfirm) { setRegError("Preencha todos os campos."); return; }
    if (regPassword.length < 6) { setRegError("A senha deve ter pelo menos 6 caracteres."); return; }
    if (regPassword !== regConfirm) { setRegError("As senhas não coincidem."); return; }
    setRegLoading(true);
    try {
      await register(regName, regEmail, regPassword);
      navigate("/");
    } catch (err) {
      setRegError(err instanceof Error ? err.message : "Erro ao cadastrar.");
    } finally {
      setRegLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background — global */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-red-600/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-red-700/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 14px)" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-6xl grid lg:grid-cols-[1.1fr_1fr] gap-0 lg:gap-12 items-center">

          {/* Brand panel — left (desktop) */}
          <aside className="hidden lg:flex flex-col gap-7 pr-4 relative">
            {/* Header lockup — name only */}
            <div className="relative">
              {/* Big watermark "PS" behind the text */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-8 -left-4 text-[10rem] font-black italic leading-none text-red-600/[0.08] select-none tracking-tighter"
              >
                PS
              </span>
              <div className="relative leading-none">
                <div className="flex items-center gap-3 mb-2">
                  <span className="h-[3px] w-10 bg-gradient-to-r from-red-600 to-red-400 rounded-full" />
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-red-400">Loja oficial</p>
                </div>
                <p className="text-[3.4rem] xl:text-[4rem] font-black uppercase italic tracking-tighter leading-[0.82] bg-gradient-to-br from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent drop-shadow-[0_2px_18px_rgba(220,38,38,0.35)]">
                  Paixão
                </p>
                <div className="flex items-end gap-3 mt-1">
                  <p className="text-[2rem] xl:text-[2.4rem] font-black uppercase italic tracking-tighter leading-[0.82] bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent pr-2">
                    Suplementos
                  </p>
                  <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(220,38,38,0.9)] mb-2" />
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="h-px w-8 bg-neutral-700" />
                  <span className="text-[9px] font-black uppercase tracking-[0.35em] text-neutral-500">Desde 2025 · Brasil</span>
                </div>
              </div>
            </div>

            {/* Hero with side art */}
            <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600/20 to-red-700/10 ring-1 ring-red-600/40 text-red-400 font-black px-3 py-1 uppercase tracking-[0.25em] text-[10px] mb-5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  Bem-vindo
                </span>
                <h1 className="text-4xl xl:text-[2.85rem] font-black uppercase italic tracking-tight leading-[0.92] mb-4">
                  Sua jornada<br />
                  de <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent pr-1.5">resultados</span>
                    {/* Brush underline */}
                    <svg viewBox="0 0 220 14" className="absolute -bottom-1 left-0 w-full h-2.5" preserveAspectRatio="none" aria-hidden="true">
                      <path d="M2 8 Q 50 2 110 7 T 218 6" stroke="#dc2626" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.85" />
                    </svg>
                  </span><br />
                  começa aqui.
                </h1>
                <p className="text-neutral-400 text-[15px] leading-relaxed max-w-md">
                  Produtos originais <span className="text-white font-bold">Max Titanium</span> e <span className="text-white font-bold">Probiótica</span>, frete grátis pra todo o Brasil e atendimento direto no WhatsApp.
                </p>
              </div>
              {/* Big SVG hero art */}
              <div className="hidden xl:block w-[220px] h-[220px] -mr-6 opacity-95">
                <HeroArt className="w-full h-full" />
              </div>
            </div>

            {/* Benefit cards with custom SVG art */}
            <div className="grid grid-cols-1 gap-2.5 max-w-md">
              {[
                { Art: ShieldStarArt, label: "100% originais", sub: "Direto da distribuidora oficial" },
                { Art: TruckArt, label: "Frete grátis", sub: "Entrega para todo o Brasil" },
                { Art: TagArt, label: "Promoções exclusivas", sub: "Avisos por e-mail e WhatsApp" },
                { Art: FlashArt, label: "Atendimento rápido", sub: "Respondemos no WhatsApp em minutos" },
              ].map(({ Art, label, sub }) => (
                <div
                  key={label}
                  className="group relative flex items-center gap-3.5 p-3 rounded-xl bg-gradient-to-r from-white/[0.04] to-white/[0.01] ring-1 ring-white/10 backdrop-blur-sm hover:ring-red-600/30 hover:from-red-600/[0.06] transition-all"
                >
                  <div className="relative w-11 h-11 shrink-0 rounded-xl bg-red-600/10 ring-1 ring-red-600/30 flex items-center justify-center overflow-hidden text-red-500 group-hover:bg-red-600/15 group-hover:ring-red-600/50 transition-colors">
                    <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-600/20 blur-md" aria-hidden="true" />
                    <Art className="relative w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-black uppercase text-xs tracking-[0.15em]">{label}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{sub}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-700 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all" strokeWidth={3} />
                </div>
              ))}
            </div>

            {/* Brand strip */}
            <div className="relative overflow-hidden rounded-xl ring-1 ring-white/10 bg-gradient-to-r from-black via-neutral-950 to-black px-4 py-2.5">
              <div className="flex items-center justify-between gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500">
                <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-red-500" />Max Titanium</span>
                <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-red-500" />Probiótica</span>
                <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-red-500" />Paixão</span>
              </div>
            </div>
          </aside>

          {/* Form card — right */}
          <div className="relative">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-6">
              <Link href="/">
                <div className="inline-block relative cursor-pointer">
                  <div className="absolute inset-0 rounded-2xl bg-red-600/40 blur-xl" />
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 ring-1 ring-red-400/40 shadow-2xl shadow-red-600/50 flex items-center justify-center mx-auto overflow-hidden">
                    <img src={logo} alt="Paixão Suplementos" className="w-14 h-14 object-contain" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Decorative gradient frame */}
            <div className="relative rounded-[28px] p-px bg-gradient-to-br from-red-600/60 via-white/10 to-red-700/40 shadow-[0_20px_80px_-20px_rgba(220,38,38,0.5)]">
              <div className="rounded-[27px] bg-neutral-950/95 backdrop-blur-2xl overflow-hidden">
                {/* Tab pill switcher */}
                <div className="px-7 pt-7">
                  <div className="relative grid grid-cols-2 p-1 rounded-full bg-neutral-900 ring-1 ring-neutral-800">
                    <span
                      className={`absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-gradient-to-r from-red-600 to-red-700 shadow-lg shadow-red-600/40 transition-transform duration-300 ${
                        tab === "login" ? "translate-x-0" : "translate-x-full"
                      }`}
                      aria-hidden="true"
                    />
                    <button
                      type="button"
                      onClick={() => setTab("login")}
                      className={`relative z-10 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${
                        tab === "login" ? "text-white" : "text-neutral-500"
                      }`}
                      data-testid="tab-login"
                    >
                      Entrar
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab("register")}
                      className={`relative z-10 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${
                        tab === "register" ? "text-white" : "text-neutral-500"
                      }`}
                      data-testid="tab-register"
                    >
                      Criar conta
                    </button>
                  </div>
                </div>

                <div className="p-7 md:p-9">
                  {tab === "login" ? (
                    <>
                      <h2 className="text-3xl font-black uppercase italic tracking-tight mb-1.5">Bem-vindo<br className="sm:hidden" /> de volta</h2>
                      <p className="text-sm text-neutral-400 mb-7">Acesse sua conta para continuar comprando.</p>

                      <form onSubmit={handleLogin} className="space-y-4">
                        <FloatingInput
                          icon={Mail}
                          type="email"
                          label="E-mail"
                          value={loginEmail}
                          onChange={setLoginEmail}
                          autoComplete="email"
                          testId="input-login-email"
                          placeholder="seu@email.com"
                        />

                        <div>
                          <FloatingInput
                            icon={Lock}
                            type={showPassword ? "text" : "password"}
                            label="Senha"
                            value={loginPassword}
                            onChange={setLoginPassword}
                            autoComplete="current-password"
                            testId="input-login-password"
                            placeholder="••••••••"
                            trailing={
                              <button
                                type="button"
                                onClick={() => setShowPassword(s => !s)}
                                className="text-neutral-500 hover:text-white transition-colors p-1"
                                aria-label="Mostrar senha"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            }
                          />
                          <div className="flex items-center justify-between mt-2.5">
                            <label className="flex items-center gap-2 text-xs text-neutral-400 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="w-3.5 h-3.5 accent-red-600 rounded"
                              />
                              Lembrar de mim
                            </label>
                            <Link href="/esqueci-senha" className="text-xs text-red-500 hover:text-red-400 font-bold uppercase tracking-wider" data-testid="link-forgot-password">
                              Esqueci a senha
                            </Link>
                          </div>
                        </div>

                        {loginError && (
                          <div className="bg-red-950/40 border border-red-900/60 text-red-400 text-sm px-4 py-3 font-medium rounded-xl flex items-start gap-2" data-testid="text-login-error">
                            <span className="w-1 h-1 rounded-full bg-red-500 mt-2 shrink-0" />
                            {loginError}
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={loginLoading}
                          className="group relative w-full overflow-hidden bg-gradient-to-r from-red-600 to-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black uppercase tracking-[0.2em] py-4 rounded-full transition-all hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] hover:-translate-y-0.5 ring-1 ring-red-400/40"
                          data-testid="button-login"
                        >
                          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                          <span className="relative inline-flex items-center justify-center gap-2 text-sm">
                            {loginLoading ? "Entrando..." : "Entrar na conta"}
                            {!loginLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={3} />}
                          </span>
                        </button>
                      </form>

                      <div className="flex items-center gap-3 my-6">
                        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-neutral-800" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-600">ou</span>
                        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-neutral-800" />
                      </div>

                      <p className="text-center text-sm text-neutral-400">
                        Ainda não tem conta?{" "}
                        <button onClick={() => setTab("register")} className="text-red-500 hover:text-red-400 font-black uppercase tracking-wider text-xs">
                          Cadastre-se grátis
                        </button>
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-3xl font-black uppercase italic tracking-tight mb-1.5">Crie sua conta</h2>
                      <p className="text-sm text-neutral-400 mb-7">Leva menos de 1 minuto e é totalmente grátis.</p>

                      <form onSubmit={handleRegister} className="space-y-4">
                        <FloatingInput
                          icon={UserIcon}
                          type="text"
                          label="Nome completo"
                          value={regName}
                          onChange={setRegName}
                          autoComplete="name"
                          testId="input-register-name"
                          placeholder="João da Silva"
                        />
                        <FloatingInput
                          icon={Mail}
                          type="email"
                          label="E-mail"
                          value={regEmail}
                          onChange={setRegEmail}
                          autoComplete="email"
                          testId="input-register-email"
                          placeholder="seu@email.com"
                        />
                        <FloatingInput
                          icon={Lock}
                          type={showRegPassword ? "text" : "password"}
                          label="Senha"
                          value={regPassword}
                          onChange={setRegPassword}
                          autoComplete="new-password"
                          testId="input-register-password"
                          placeholder="Mínimo 6 caracteres"
                          trailing={
                            <button
                              type="button"
                              onClick={() => setShowRegPassword(s => !s)}
                              className="text-neutral-500 hover:text-white transition-colors p-1"
                              aria-label="Mostrar senha"
                            >
                              {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          }
                        />
                        <FloatingInput
                          icon={Lock}
                          type="password"
                          label="Confirmar senha"
                          value={regConfirm}
                          onChange={setRegConfirm}
                          autoComplete="new-password"
                          testId="input-register-confirm"
                          placeholder="Repita a senha"
                        />

                        {regError && (
                          <div className="bg-red-950/40 border border-red-900/60 text-red-400 text-sm px-4 py-3 font-medium rounded-xl flex items-start gap-2" data-testid="text-register-error">
                            <span className="w-1 h-1 rounded-full bg-red-500 mt-2 shrink-0" />
                            {regError}
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={regLoading}
                          className="group relative w-full overflow-hidden bg-gradient-to-r from-red-600 to-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black uppercase tracking-[0.2em] py-4 rounded-full transition-all hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] hover:-translate-y-0.5 ring-1 ring-red-400/40"
                          data-testid="button-register"
                        >
                          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                          <span className="relative inline-flex items-center justify-center gap-2 text-sm">
                            {regLoading ? "Criando conta..." : "Criar conta"}
                            {!regLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={3} />}
                          </span>
                        </button>
                      </form>

                      <p className="text-center text-sm text-neutral-400 mt-6">
                        Já tem uma conta?{" "}
                        <button onClick={() => setTab("login")} className="text-red-500 hover:text-red-400 font-black uppercase tracking-wider text-xs">
                          Entrar
                        </button>
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Footer links */}
            <div className="mt-6 flex items-center justify-center gap-5 text-[11px]">
              <Link href="/" className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white uppercase tracking-wider font-bold transition-colors">
                <ArrowLeft className="w-3 h-3" strokeWidth={3} />
                Voltar para a loja
              </Link>
              <span className="w-1 h-1 rounded-full bg-neutral-700" />
              <Link href="/admin/login" className="text-neutral-600 hover:text-neutral-400 transition-colors uppercase tracking-wider">
                Acesso administrativo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type IconType = typeof Mail;

function FloatingInput({
  icon: Icon,
  type,
  label,
  value,
  onChange,
  autoComplete,
  testId,
  placeholder,
  trailing,
}: {
  icon: IconType;
  type: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  testId?: string;
  placeholder?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="group relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-red-500 transition-colors pointer-events-none">
        <Icon className="w-4 h-4" strokeWidth={2.25} />
      </div>
      <label className="absolute left-11 -top-2 px-1.5 bg-neutral-950 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500 group-focus-within:text-red-500 transition-colors">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        data-testid={testId}
        className={`w-full bg-neutral-900/60 ring-1 ring-neutral-800 rounded-2xl pl-11 pr-${trailing ? "12" : "4"} py-3.5 text-white text-sm placeholder:text-neutral-600 outline-none focus:ring-red-600/60 focus:bg-neutral-900 transition-all`}
      />
      {trailing && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{trailing}</div>
      )}
    </div>
  );
}
