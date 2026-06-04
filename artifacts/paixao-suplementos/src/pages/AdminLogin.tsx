import { useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, ArrowRight, Lock as LockIcon } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

/* ---------- Custom Shield Art ---------- */
function ShieldArt({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 220" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="adminShieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
        <linearGradient id="adminShieldInner" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#171717" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
        <radialGradient id="adminShieldGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#dc2626" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="190" rx="70" ry="10" fill="url(#adminShieldGlow)" />
      <path d="M100 15 L170 40 L170 110 Q170 165 100 200 Q30 165 30 110 L30 40 Z"
        fill="url(#adminShieldGrad)" stroke="#fca5a5" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M100 30 L155 50 L155 110 Q155 155 100 185 Q45 155 45 110 L45 50 Z"
        fill="url(#adminShieldInner)" stroke="#dc2626" strokeWidth="1" strokeOpacity="0.5" />
      {/* Lock icon inside */}
      <rect x="80" y="100" width="40" height="34" rx="4" fill="#dc2626" stroke="#fca5a5" strokeWidth="1" />
      <path d="M88 100 L88 88 Q88 76 100 76 Q112 76 112 88 L112 100" stroke="#dc2626" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="100" cy="115" r="3" fill="#fca5a5" />
      <rect x="98" y="115" width="4" height="10" fill="#fca5a5" />
      {/* Top P monogram */}
      <text x="100" y="68" textAnchor="middle" fill="#fca5a5" fontSize="18" fontWeight="900" fontStyle="italic" fontFamily="system-ui">P</text>
    </svg>
  );
}

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Preencha todos os campos."); return; }
    setLoading(true);
    try {
      const u = await login(email, password);
      if (u.role !== "admin") {
        setError("Esta conta não tem permissão de administrador.");
        return;
      }
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Credenciais incorretas.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black flex items-center justify-center px-4 py-10">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-red-700/25 blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-red-900/30 blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:48px_48px]" />
        {/* Diagonal stripes top */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-60" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-neutral-400 hover:text-white mb-6 transition-colors"
          data-testid="link-back-store"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para a loja
        </Link>

        {/* Header lockup */}
        <div className="text-center mb-7">
          <div className="relative inline-block mb-5">
            <div className="absolute -inset-4 rounded-full bg-red-600/40 blur-2xl" aria-hidden="true" />
            <ShieldArt className="relative w-24 h-26 drop-shadow-[0_0_18px_rgba(220,38,38,0.5)]" />
          </div>
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-[3px] w-8 bg-gradient-to-r from-red-600 to-red-400 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-400">Acesso restrito</span>
            <span className="h-[3px] w-8 bg-gradient-to-r from-red-400 to-red-600 rounded-full" />
          </div>
          <h1 className="text-4xl sm:text-[2.6rem] font-black uppercase italic tracking-tighter leading-[0.85] text-white">
            Área do{" "}
            <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent pr-2 inline-block">
              Admin
            </span>
          </h1>
          <p className="text-neutral-500 text-xs font-medium mt-3 tracking-wide">
            Painel administrativo · Apenas pessoal autorizado
          </p>
        </div>

        {/* Form panel */}
        <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-br from-red-700/60 via-red-900/30 to-neutral-900 shadow-[0_30px_80px_-20px_rgba(220,38,38,0.5)]">
          <div className="rounded-3xl bg-neutral-950/95 backdrop-blur p-7 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-md shadow-red-600/40">
                <ShieldCheck className="w-4 h-4 text-white" />
              </span>
              <div className="leading-none">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400">Login</p>
                <p className="text-sm font-black uppercase tracking-wider text-white mt-1">Administrador</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2 block">E-mail</span>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@paixao.com.br"
                    autoComplete="email"
                    className="w-full bg-neutral-900/80 border border-neutral-800 focus:border-red-600/70 focus:bg-neutral-900 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder:text-neutral-600 text-sm font-medium outline-none transition-all"
                    data-testid="input-email"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2 block">Senha</span>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                    className="w-full bg-neutral-900/80 border border-neutral-800 focus:border-red-600/70 focus:bg-neutral-900 rounded-2xl pl-11 pr-12 py-3.5 text-white placeholder:text-neutral-600 text-sm font-medium outline-none transition-all"
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                    aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </label>

              {error && (
                <div className="bg-red-950/40 border border-red-900/60 text-red-400 text-sm px-4 py-3 font-medium rounded-xl flex items-start gap-2" data-testid="login-error">
                  <span className="w-1 h-1 rounded-full bg-red-500 mt-2 shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group relative overflow-hidden mt-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black uppercase tracking-wider text-sm py-4 rounded-full shadow-lg shadow-red-600/40 transition-all"
                data-testid="button-login"
              >
                <span className="relative z-10 inline-flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Entrar no painel
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </span>
                {/* Shimmer */}
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-neutral-900 flex items-center justify-center gap-2 text-[11px] text-neutral-500">
              <LockIcon className="w-3 h-3" />
              <span>Conexão criptografada · sessão protegida</span>
            </div>
          </div>
        </div>

        <p className="text-center text-neutral-600 text-[11px] mt-6 font-medium tracking-wider">
          PAIXÃO SUPLEMENTOS · Painel administrativo
        </p>
      </div>
    </div>
  );
}
