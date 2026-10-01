import React, { useState, useEffect } from 'react';

export default function PaywallModal({
  isOpen,
  freeLimitResetAt,
  onClose,
  onUpgrade,
}) {
  const [timeLeft, setTimeLeft] = useState({ hours: 24, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!isOpen) return;

    function updateCountdown() {
      if (!freeLimitResetAt) {
        setTimeLeft({ hours: 24, minutes: 0, seconds: 0 });
        return;
      }

      const now = new Date().getTime();
      const target = new Date(freeLimitResetAt).getTime();
      const diff = Math.max(0, target - now);

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [isOpen, freeLimitResetAt]);

  if (!isOpen) return null;

  const pad = (num) => String(num).padStart(2, '0');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-[480px] bg-surface-container-lowest rounded-t-[28px] sm:rounded-[28px] shadow-2xl p-6 sm:p-7 flex flex-col gap-5 animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Header com Fechar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant shadow-xs">
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bolt
            </span>
            <span className="font-label-badge text-label-badge font-bold uppercase tracking-wider">
              Limite Diário Atingido
            </span>
          </div>
          <button
            type="button"
            aria-label="Fechar modal"
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Headline & Ilustração */}
        <div className="flex flex-col items-center text-center">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary-container shadow-md mb-3 text-on-secondary animate-bounce">
            <span
              className="material-symbols-outlined text-[32px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              workspace_premium
            </span>
          </div>
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold tracking-tight">
            Você esgotou seus 10 swipes gratuitos
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 leading-relaxed max-w-[340px]">
            O plano gratuito libera 10 cards a cada 24 horas. Desbloqueie o acesso ilimitado para acelerar sua nota 900+ sem interrupções.
          </p>
        </div>

        {/* Contador Regressivo para Próximo Pacote Grátis */}
        <div className="w-full bg-surface-container-low rounded-2xl p-4 flex items-center justify-between border border-surface-container">
          <div className="flex flex-col">
            <span className="font-label-badge text-label-badge text-on-surface-variant uppercase tracking-wider font-semibold">
              Próximo pacote gratuito em
            </span>
            <span className="text-xs text-outline">Libera mais 10 cards</span>
          </div>
          <div className="flex items-center gap-1 font-mono font-bold text-headline-sm text-secondary bg-surface-container-lowest px-3 py-1.5 rounded-xl shadow-xs border border-surface-container">
            <span>{pad(timeLeft.hours)}</span>
            <span>:</span>
            <span>{pad(timeLeft.minutes)}</span>
            <span>:</span>
            <span>{pad(timeLeft.seconds)}</span>
          </div>
        </div>

        {/* Benefícios Premium */}
        <div className="flex flex-col gap-2.5 pt-1">
          <span className="font-label-badge text-label-badge text-primary uppercase tracking-wider font-bold">
            Vantagens do Acesso Premium:
          </span>

          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container-low">
              <div className="w-7 h-7 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary-container shrink-0">
                <span className="material-symbols-outlined text-[18px]">all_inclusive</span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface font-medium">
                <strong>Swipes Ilimitados:</strong> Estude quantos cards quiser por dia.
              </span>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container-low">
              <div className="w-7 h-7 rounded-lg bg-primary-fixed flex items-center justify-center text-primary-container shrink-0">
                <span className="material-symbols-outlined text-[18px]">alt_route</span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface font-medium">
                <strong>Todas as 7 Trilhas:</strong> Acesso irrestrito aos 162 cards validados.
              </span>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container-low">
              <div className="w-7 h-7 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[18px]">insights</span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface font-medium">
                <strong>Diagnóstico ENEM:</strong> Mapeamento real das 5 competências.
              </span>
            </div>
          </div>
        </div>

        {/* CTA Principal */}
        <div className="flex flex-col gap-2.5 pt-2">
          <button
            type="button"
            className="w-full h-13 rounded-2xl bg-secondary-container text-on-secondary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all cursor-pointer hover:opacity-95"
            onClick={onUpgrade}
          >
            <span>Desbloquear Acesso Ilimitado</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
          <button
            type="button"
            className="w-full py-2.5 text-center font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            onClick={onClose}
          >
            Continuar no plano gratuito
          </button>
        </div>
      </div>
    </div>
  );
}
