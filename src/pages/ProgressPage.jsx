import React from 'react';

export default function ProgressPage({
  streak = 5,
  stats = { domino: 118, revisar: 36, novos: 18 },
  onOpenProfile,
  onStartStudy,
}) {
  const total = stats.domino + stats.revisar + stats.novos;
  const masteryPercent = total > 0 ? Math.round((stats.domino / total) * 100) : 68;

  // Cálculo da circunferência para o anel SVG de raio 68
  const radius = 68;
  const circumference = 2 * Math.PI * radius; // ~427.25
  const strokeDashoffset = circumference - (circumference * masteryPercent) / 100;

  const competencies = [
    { name: 'Competência 1', label: 'Norma Culta & Gramática', score: '160/200', pct: 80, bar: 'bg-primary-container' },
    { name: 'Competência 2', label: 'Compreensão & Repertório', score: '180/200', pct: 90, bar: 'bg-tertiary-container' },
    { name: 'Competência 3', label: 'Projeto de Texto & Argumento', score: '160/200', pct: 80, bar: 'bg-primary-container' },
    { name: 'Competência 4', label: 'Coesão & Conectivos', score: '140/200', pct: 70, bar: 'bg-primary-fixed-dim' },
    { name: 'Competência 5', label: 'Proposta de Intervenção', score: '120/200', pct: 60, bar: 'bg-secondary-container', alert: true },
  ];

  return (
    <div className="bg-surface text-on-surface antialiased flex flex-col min-h-screen">
      {/* Header Fixo */}
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="max-w-[480px] mx-auto h-16 px-margin flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-[24px]">insights</span>
            <h1 className="font-headline-md text-headline-md text-primary tracking-tight font-bold">
              Progresso
            </h1>
          </div>
          <div className="flex items-center gap-space-sm">
            <button
              aria-label="Notificações"
              type="button"
              className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
            </button>
            <button
              aria-label="Meu Perfil"
              type="button"
              onClick={onOpenProfile}
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm hover:opacity-95 transition-opacity cursor-pointer"
            >
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col w-full max-w-[480px] mx-auto px-margin pt-16 pb-24 bg-surface relative">
        <div className="flex flex-col w-full pb-6 space-y-4">
          {/* 1. Visão Geral / Domínio Geral */}
          <section className="w-full bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col items-center relative overflow-hidden">
            <div className="w-full flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <span className="font-label-badge text-label-badge text-on-surface-variant uppercase tracking-wider">
                  Desempenho Geral
                </span>
                <span className="font-headline-sm text-headline-sm text-primary font-bold">
                  Domínio dos Cards
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-full text-on-surface-variant">
                  <span
                    className="material-symbols-outlined text-[16px] text-secondary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    local_fire_department
                  </span>
                  <span className="font-label-md text-label-md font-semibold text-secondary">
                    {streak} dias
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-full text-on-surface-variant">
                  <span
                    className="material-symbols-outlined text-[16px] text-tertiary-container"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    bolt
                  </span>
                  <span className="font-label-md text-label-md font-semibold text-primary">
                    Nível 4
                  </span>
                </div>
              </div>
            </div>

            {/* Anel de Progresso Minimalista */}
            <div className="relative w-44 h-44 flex items-center justify-center my-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Fundo do anel */}
                <circle
                  className="text-surface-container"
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="12"
                />
                {/* Arco de Progresso */}
                <circle
                  className="text-primary-container transition-all duration-1000 ease-out"
                  cx="80"
                  cy="80"
                  fill="transparent"
                  id="progress-ring-circle"
                  r={radius}
                  stroke="currentColor"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  strokeWidth="12"
                />
              </svg>

              {/* Conteúdo Central */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-display-mobile text-display-mobile text-primary font-bold leading-none tracking-tight">
                  {masteryPercent}%
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant mt-1 font-medium">
                  {stats.domino} / {total} cards
                </span>
              </div>
            </div>

            {/* Trinca de Métricas */}
            <div className="w-full pt-3 flex items-center justify-around text-center">
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm font-bold text-tertiary-container">
                  {stats.domino}
                </span>
                <span className="font-label-badge text-label-badge text-on-surface-variant uppercase">
                  Dominados
                </span>
              </div>
              <div className="w-px h-8 bg-surface-container" />
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm font-bold text-secondary">
                  {stats.revisar}
                </span>
                <span className="font-label-badge text-label-badge text-on-surface-variant uppercase">
                  A Revisar
                </span>
              </div>
              <div className="w-px h-8 bg-surface-container" />
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm font-bold text-outline">
                  {stats.novos}
                </span>
                <span className="font-label-badge text-label-badge text-on-surface-variant uppercase">
                  Novos
                </span>
              </div>
            </div>
          </section>

          {/* 2. Bloco Prioritário: Principal Ponto de Atenção */}
          <section className="w-full bg-secondary-fixed/50 rounded-xl p-space-md shadow-sm relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0 text-on-secondary shadow-sm">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  priority_high
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-label-badge text-label-badge text-on-secondary-fixed-variant uppercase tracking-wider font-bold">
                    Atenção Prioritária
                  </span>
                </div>
                <h4 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Competência 5: Detalhamento
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  3 cards com repetição pendente para consolidar a nota máxima na intervenção.
                </p>
                <button
                  type="button"
                  className="mt-2 text-label-md text-label-md font-bold text-secondary flex items-center gap-1 cursor-pointer"
                  onClick={onStartStudy}
                >
                  Treinar agora
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </section>

          {/* 3. Breakdown por Competência */}
          <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                Mapeamento por Competência
              </h3>
              <span className="font-label-badge text-label-badge text-on-surface-variant uppercase">
                ENEM 2026
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {competencies.map((comp) => (
                <div key={comp.name} className="space-y-1">
                  <div className="flex justify-between text-body-sm">
                    <span className="font-medium text-on-surface">{comp.name}</span>
                    <span className="font-bold text-primary">{comp.score}</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${comp.bar}`}
                      style={{ width: `${comp.pct}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-on-surface-variant">{comp.label}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
