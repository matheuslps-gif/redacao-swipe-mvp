import React, { useState } from 'react';

const goalOptions = [
  {
    cards: 5,
    title: '5 cards',
    subtitle: '• Leve',
    time: 'cerca de 3 min por dia',
    icon: 'energy_savings_leaf',
    isRecommended: false,
  },
  {
    cards: 10,
    title: '10 cards',
    subtitle: '• IDEAL',
    time: 'cerca de 5 min por dia',
    icon: 'local_fire_department',
    isRecommended: true,
  },
  {
    cards: 15,
    title: '15 cards',
    subtitle: '• Intenso',
    time: 'cerca de 8 min por dia',
    icon: 'fitness_center',
    isRecommended: false,
  },
  {
    cards: 20,
    title: '20 cards',
    subtitle: '• Imersão 900+',
    time: 'cerca de 10 min por dia',
    icon: 'rocket_launch',
    isRecommended: false,
  },
];

export default function DailyGoalModal({ currentGoal = 10, onSaveGoal, onBack }) {
  const [selectedGoal, setSelectedGoal] = useState(currentGoal);

  return (
    <main className="flex flex-col relative w-full min-h-screen bg-surface px-margin pt-safe pb-safe max-w-[480px] mx-auto">
      <div className="flex flex-col w-full pb-8">
        {/* Header com voltar e indicador de passo */}
        <div className="flex items-center justify-between w-full py-4">
          <button
            aria-label="Voltar"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container text-primary active:scale-95 transition-transform duration-150 cursor-pointer"
            type="button"
            onClick={onBack}
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high">
            <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
            <span className="font-label-badge text-label-badge uppercase tracking-wider text-on-surface-variant">
              Passo 2 de 3
            </span>
          </div>
        </div>

        {/* Título e descrição */}
        <div className="flex flex-col mt-3 space-y-2">
          <span className="font-label-md text-label-md text-secondary uppercase tracking-widest">
            Rotina de Estudos
          </span>
          <h1 className="font-display-mobile text-display-mobile text-primary tracking-tight">
            Qual é a sua meta diária?
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant pt-1 leading-relaxed">
            Sessões curtas e consistentes geram mais retenção do que horas seguidas de leitura passiva.
          </p>
        </div>

        {/* Banner Informativo */}
        <div className="relative w-full rounded-2xl bg-surface-container-low p-4 mt-5 mb-2 flex items-center gap-4 overflow-hidden shadow-sm">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              timer
            </span>
          </div>
          <div className="flex flex-col min-w-0 pr-2">
            <span className="font-label-lg text-label-lg text-primary">Ritmo Circadiano ENEM</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
              Micro-doses fixam repertórios na memória de longo prazo.
            </span>
          </div>
        </div>

        {/* Lista de Opções de Meta */}
        <div
          aria-label="Selecione sua meta diária de cards"
          className="flex flex-col gap-3 mt-4"
          role="radiogroup"
        >
          {goalOptions.map((opt) => {
            const isSelected = selectedGoal === opt.cards;
            return (
              <div
                key={opt.cards}
                aria-checked={isSelected}
                role="radio"
                tabIndex={0}
                className={`goal-card relative flex items-center justify-between p-4 rounded-2xl bg-surface-container-lowest cursor-pointer transition-all duration-200 active:scale-[0.98] ${
                  isSelected ? 'selected shadow-md' : 'shadow-sm'
                }`}
                onClick={() => setSelectedGoal(opt.cards)}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    setSelectedGoal(opt.cards);
                  }
                }}
              >
                {opt.isRecommended && (
                  <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary font-label-badge text-label-badge shadow-sm flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-[12px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span>RECOMENDADO</span>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div
                    className={`icon-indicator flex items-center justify-center w-11 h-11 rounded-xl transition-colors duration-200 ${
                      isSelected
                        ? 'bg-secondary-container text-on-secondary'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[22px]"
                      style={{ fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {opt.icon}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-headline-sm text-headline-sm text-primary font-bold">
                        {opt.title}
                      </span>
                      <span
                        className={
                          opt.isRecommended
                            ? 'font-label-badge text-label-badge text-secondary font-bold tracking-wide'
                            : 'font-body-sm text-body-sm text-on-surface-variant'
                        }
                      >
                        {opt.subtitle}
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {opt.time}
                    </span>
                  </div>
                </div>

                <div
                  className={`check-circle flex items-center justify-center w-7 h-7 rounded-full transition-all duration-200 ${
                    isSelected
                      ? 'bg-secondary-container text-on-secondary shadow-sm'
                      : 'bg-surface-container-high text-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Nota de rodapé */}
        <div className="flex items-center justify-center gap-2 mt-6 px-4 text-center">
          <span className="material-symbols-outlined text-[16px] text-on-surface-variant flex-shrink-0">
            info
          </span>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Você pode alterar sua meta a qualquer momento no seu perfil.
          </p>
        </div>

        {/* Botão de Ação */}
        <div className="mt-6">
          <button
            className="w-full h-14 rounded-2xl bg-secondary-container text-on-secondary font-label-lg text-label-lg shadow-md flex items-center justify-center gap-2 active:scale-[0.97] transition-all duration-150 cursor-pointer"
            type="button"
            onClick={() => onSaveGoal?.(selectedGoal)}
          >
            <span>Começar minha revisão</span>
            <span className="material-symbols-outlined text-[20px] transition-transform duration-200">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}
