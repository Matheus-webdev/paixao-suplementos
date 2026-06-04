import { useState, type FormEvent } from "react";
import { Link } from "wouter";
import { Mail, ArrowLeft, CheckCircle2, MessageCircle } from "lucide-react";
import { api, ApiError } from "@/lib/api";

const WHATSAPP_NUMBER = "5531973268113";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post("/auth/forgot", { email: email.trim() });
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const whatsappMsg = encodeURIComponent(
    `Olá! Esqueci minha senha do site Paixão Suplementos. Meu e-mail cadastrado é: ${email.trim()}`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black flex items-center justify-center px-4 py-10">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-red-700/25 blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full bg-red-900/30 blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      <div className="relative w-full max-w-md">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-neutral-400 hover:text-white mb-6 transition-colors"
          data-testid="link-back-login"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para o login
        </Link>

        <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-br from-red-700/60 via-red-900/30 to-neutral-900 shadow-[0_30px_80px_-20px_rgba(220,38,38,0.5)]">
          <div className="rounded-3xl bg-neutral-950/95 backdrop-blur p-8 sm:p-10">
            {!sent ? (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-600/40">
                    <Mail className="w-5 h-5 text-white" />
                  </span>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-red-400">Recuperar acesso</p>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter text-white leading-[0.9] mb-3">
                  Esqueceu a <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">senha?</span>
                </h1>
                <p className="text-sm text-neutral-400 mb-8 leading-relaxed">
                  Sem stress! Informe o e-mail cadastrado e a gente te envia um link pelo WhatsApp pra você criar uma nova senha.
                </p>

                <form onSubmit={submit} className="flex flex-col gap-5">
                  <label className="block">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2 block">E-mail</span>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        autoComplete="email"
                        className="w-full bg-neutral-900/80 border border-neutral-800 focus:border-red-600/70 focus:bg-neutral-900 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder:text-neutral-600 text-sm font-medium outline-none transition-all"
                        data-testid="input-forgot-email"
                      />
                    </div>
                  </label>

                  {error && (
                    <div className="bg-red-950/40 border border-red-900/60 text-red-400 text-sm px-4 py-3 font-medium rounded-xl" data-testid="text-forgot-error">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black uppercase tracking-wider text-sm py-4 rounded-full shadow-lg shadow-red-600/40 transition-all"
                    data-testid="button-forgot-submit"
                  >
                    {loading ? "Enviando..." : "Enviar link de recuperação"}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-neutral-900">
                  <p className="text-xs text-neutral-500 text-center">
                    Lembrou a senha?{" "}
                    <Link href="/login" className="text-red-400 hover:text-red-300 font-bold">
                      Entrar
                    </Link>
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-lg shadow-green-600/40 mb-5">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-3">Pedido recebido!</h2>
                <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                  Se esse e-mail estiver cadastrado, você vai receber em instantes o link de redefinição pelo WhatsApp.
                  Para acelerar, clique no botão abaixo e nos chame:
                </p>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-black uppercase tracking-wider text-sm py-4 rounded-full shadow-lg shadow-green-600/40 transition-all"
                  data-testid="link-whatsapp-recovery"
                >
                  <MessageCircle className="w-4 h-4" />
                  Falar no WhatsApp
                </a>

                <p className="text-[11px] text-neutral-600 mt-5">
                  O link enviado expira em 1 hora.
                </p>

                <Link
                  href="/login"
                  className="inline-block mt-6 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white"
                >
                  Voltar para o login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
