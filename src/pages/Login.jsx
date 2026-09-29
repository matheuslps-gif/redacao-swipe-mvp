import { useState } from "react";

export default function Login({ onBack, onGoogle, onSubmit, onForgotPassword }) {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const isLogin = mode === "login";

  function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSubmit?.({ mode, name: form.get("name"), email: form.get("email"), password: form.get("password") });
  }

  return (
    <main className="bg-surface text-on-surface antialiased flex flex-col min-h-screen pt-safe pb-safe flex-1 w-full max-w-[480px] mx-auto px-margin relative justify-center">
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between py-space-sm">
          <button aria-label="Voltar" className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-low text-on-surface active:scale-95 transition-transform duration-150 shadow-sm" type="button" onClick={onBack}>
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container text-on-primary shadow-sm">
            <span className="material-symbols-outlined text-[13px] text-tertiary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <span className="font-label-badge text-label-badge tracking-wider">ENEM 2025</span>
          </div>
        </div>
        <div className="flex flex-col items-center mt-space-md text-center">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-container shadow-md mb-space-sm text-on-primary">
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-lg bg-secondary-container flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[14px] text-on-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            </div>
            <span className="material-symbols-outlined text-[28px] text-primary-fixed">style</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight font-extrabold">redação</span>
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-secondary font-extrabold">.swipe</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Domine o repertório e a estrutura da Nota 1000</p>
        </div>
        <div className="p-1 rounded-full bg-surface-container mt-space-md flex items-center relative">
          <div className="absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] bg-surface-container-lowest rounded-full shadow-sm transition-transform duration-300 ease-out" style={{ transform: isLogin ? "translateX(0%)" : "translateX(100%)" }} />
          <button className={`relative z-10 flex-1 py-2 text-center font-label-lg text-label-lg transition-colors ${isLogin ? "text-primary" : "text-on-surface-variant"}`} type="button" onClick={() => setMode("login")}>Entrar</button>
          <button className={`relative z-10 flex-1 py-2 text-center font-label-lg text-label-lg transition-colors ${isLogin ? "text-on-surface-variant" : "text-primary"}`} type="button" onClick={() => setMode("register")}>Criar conta</button>
        </div>
        <div className="mt-space-md">
          <button className="w-full h-12 px-4 rounded-xl bg-surface-container-lowest flex items-center justify-center gap-3 shadow-sm active:scale-[0.98] transition-transform" type="button" onClick={onGoogle}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            <span className="font-label-lg text-label-lg text-on-surface">Continuar com Google</span>
          </button>
        </div>
        <div className="flex items-center my-space-md">
          <div className="flex-1 h-[1px] bg-surface-variant" />
          <span className="px-3 font-body-sm text-body-sm text-outline">ou continue com e-mail</span>
          <div className="flex-1 h-[1px] bg-surface-variant" />
        </div>
        <form className="flex flex-col gap-space-sm" onSubmit={handleSubmit}>
          <div className={`flex flex-col gap-1 ${isLogin ? "hidden" : ""}`}>
            <label htmlFor="auth-name" className="font-label-badge text-label-badge text-on-surface-variant uppercase tracking-wider">Nome completo</label>
            <div className="flex items-center px-3.5 h-12 bg-surface-container-low rounded-xl focus-within:bg-surface-container-lowest transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[20px] text-outline mr-2.5">person</span>
              <input id="auth-name" name="name" className="w-full bg-transparent font-body-md text-body-md text-on-surface outline-none placeholder:text-outline" placeholder="Seu nome" type="text" required={!isLogin} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="auth-email" className="font-label-badge text-label-badge text-on-surface-variant uppercase tracking-wider">E-mail</label>
            <div className="flex items-center px-3.5 h-12 bg-surface-container-low rounded-xl focus-within:bg-surface-container-lowest transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[20px] text-outline mr-2.5">mail</span>
              <input id="auth-email" name="email" className="w-full bg-transparent font-body-md text-body-md text-on-surface outline-none placeholder:text-outline" placeholder="seu.email@exemplo.com" required type="email" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label htmlFor="auth-password" className="font-label-badge text-label-badge text-on-surface-variant uppercase tracking-wider">Senha</label>
              <button className={`font-body-sm text-body-sm text-secondary hover:underline ${isLogin ? "" : "invisible"}`} type="button" onClick={onForgotPassword}>Esqueci a senha</button>
            </div>
            <div className="flex items-center px-3.5 h-12 bg-surface-container-low rounded-xl focus-within:bg-surface-container-lowest transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[20px] text-outline mr-2.5">lock</span>
              <input id="auth-password" name="password" className="w-full bg-transparent font-body-md text-body-md text-on-surface outline-none placeholder:text-outline" placeholder="••••••••" required type={showPassword ? "text" : "password"} />
              <button className="text-outline p-1 active:scale-90 transition-transform" type="button" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} onClick={() => setShowPassword(value => !value)}>
                <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 px-1 text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
            <span className="font-body-sm text-body-sm text-outline">Seus dados e ofensiva 100% sincronizados em nuvem.</span>
          </div>
          <button className="mt-2 w-full h-12 bg-secondary-container text-on-secondary font-label-lg text-label-lg rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all" type="submit">
            <span>{isLogin ? "Entrar na minha conta" : "Começar minha preparação"}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </form>
        <div className="flex flex-col items-center gap-space-sm mt-space-md pb-space-sm text-center">
          <button className="font-body-sm text-body-sm text-on-surface-variant" type="button" onClick={() => setMode(isLogin ? "register" : "login")}>
            {isLogin ? "Ainda não tem conta? " : "Já possui uma conta? "}
            <span className={`font-label-lg font-bold ${isLogin ? "text-secondary" : "text-primary"}`}>{isLogin ? "Cadastre-se em 30s" : "Entrar agora"}</span>
          </button>
          <p className="font-body-sm text-body-sm text-outline px-4 text-[11px] leading-snug">Ao continuar, você concorda com os Termos de Uso e Política de Privacidade do Redação Swipe.</p>
        </div>
      </div>
    </main>
  );
}
