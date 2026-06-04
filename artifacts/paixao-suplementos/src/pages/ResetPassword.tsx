import { useState, useEffect, type FormEvent } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Lock, Eye, EyeOff, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { api, ApiError } from "@/lib/api";

type ResetInfo = { email: string; name: string };

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const token = new URLSearchParams(search).get("token") ?? "";

  const [info, setInfo] = useState<ResetInfo | null>(null);
  const [infoError, setInfoError] = useState<string | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(true);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) {
      setInfoError("Link inválido. Solicite uma nova recuperação de senha.");
      setLoadingInfo(false);
      return;
    }
    api.get<ResetInfo>(`/auth/reset-info?token=${encodeURIComponent(token)}`)
      .then(setInfo)
      .catch((e) => setInfoError(e instanceof ApiError ? e.message : "Não foi possível validar o link."))
      .finally(() => setLoadingInfo(false));
  }, [token]);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setLocation("/login"), 2500);
    return () => clearTimeout(t);
  }, [done, setLocation]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/auth/reset", { token, password });
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erro inesperado. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black flex items-center justify-center px-4 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-red-700/25 blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full bg-red-900/30 blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-br from-red-700/60 via-red-900/30 to-neutral-900 shadow-[0_30px_80px_-20px_rgba(220,38,38,0.5)]">
          <div className="rounded-3xl bg-neutral-950/95 backdrop-blur p-8 sm:p-10">
            {loadingInfo ? (
              <div className="text-center py-10 text-neutral-500 text-sm">Validando link...</div>
            ) : infoError ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-red-950 ring-1 ring-red-900 flex items-center justify-center mb-5">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-3">Link inválido</h2>
                <p className="text-sm text-neutral-400 mb-6" data-testid="text-reset-error">{infoError}</p>
                <Link
                  href="/esqueci-senha"
                  className="inline-block bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black uppercase tracking-wider text-xs px-6 py-3 rounded-full shadow-lg shadow-red-600/40"
                >
                  Solicitar novo link
                </Link>
              </div>
            ) : done ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-lg shadow-green-600/40 mb-5">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-3">Senha redefinida!</h2>
                <p className="text-sm text-neutral-400">Redirecionando para o login...</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-600/40">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </span>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-red-400">Nova senha</p>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter text-white leading-[0.9] mb-3">
                  Olá, {info?.name}!
                </h1>
                <p className="text-sm text-neutral-400 mb-7 leading-relaxed">
                  Crie uma nova senha para a conta <span className="text-neutral-200 font-bold">{info?.email}</span>.
                </p>

                <form onSubmit={submit} className="flex flex-col gap-4">
                  <label className="block">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2 block">Nova senha</span>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type={show ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        autoComplete="new-password"
                        className="w-full bg-neutral-900/80 border border-neutral-800 focus:border-red-600/70 focus:bg-neutral-900 rounded-2xl pl-11 pr-12 py-3.5 text-white placeholder:text-neutral-600 text-sm font-medium outline-none transition-all"
                        data-testid="input-new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShow((s) => !s)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                        aria-label={show ? "Esconder senha" : "Mostrar senha"}
                      >
                        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2 block">Confirme a senha</span>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type={show ? "text" : "password"}
                        required
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Repita a senha"
                        autoComplete="new-password"
                        className="w-full bg-neutral-900/80 border border-neutral-800 focus:border-red-600/70 focus:bg-neutral-900 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder:text-neutral-600 text-sm font-medium outline-none transition-all"
                        data-testid="input-confirm-password"
                      />
                    </div>
                  </label>

                  {error && (
                    <div className="bg-red-950/40 border border-red-900/60 text-red-400 text-sm px-4 py-3 font-medium rounded-xl" data-testid="text-reset-submit-error">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-60 text-white font-black uppercase tracking-wider text-sm py-4 rounded-full shadow-lg shadow-red-600/40 transition-all"
                    data-testid="button-reset-submit"
                  >
                    {submitting ? "Salvando..." : "Redefinir senha"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
