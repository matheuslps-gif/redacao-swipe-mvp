import React from 'react';

export default function SessionCompleted({
  streak = 5,
  stats = { domino: 6, revisar: 3, salvo: 1 },
  totalStudied = 10,
  onContinueStudying,
  onBackToHome,
}) {
  const total = Math.max(1, stats.domino + stats.revisar + stats.salvo);
  const dominoPercent = Math.round((stats.domino / total) * 100);
  const revisarPercent = Math.round((stats.revisar / total) * 100);
  const salvoPercent = Math.max(0, 100 - dominoPercent - revisarPercent);

  return (
    <main className="flex-1 flex flex-col w-full max-w-[480px] mx-auto px-margin bg-surface relative justify-center min-h-screen pt-safe pb-safe">
      <div className="flex flex-col w-full pb-8">
        {/* Troféu & Mensagem de Sucesso */}
        <div className="relative flex flex-col items-center text-center mt-2 mb-6">
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-tertiary-container shadow-md mb-5">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-tertiary to-tertiary-container opacity-80" />
            <span
              className="material-symbols-outlined text-tertiary-fixed text-[38px] relative z-10"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              workspace_premium
            </span>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-sm">
              <span
                className="material-symbols-outlined text-tertiary-fixed-variant text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container" />
            <span className="font-label-badge text-label-badge text-on-surface-variant uppercase tracking-wider">
              Sessão Finalizada
            </span>
          </div>

          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight mb-2 font-bold">
            Meta concluída!
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-[340px] px-2 leading-relaxed">
            Você concluiu sua meta diária de estudo. Pequenos blocos consistentes constroem notas acima de 900.
          </p>
        </div>

        {/* Rendimento da Rodada */}
        <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm mb-6 relative overflow-hidden">
          <div className="flex items-center justify-between pb-4">
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase">
                Rendimento da Rodada
              </span>
              <span className="font-headline-md text-headline-md text-primary mt-0.5 font-bold">
                {totalStudied} cards estudados
              </span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-[22px]">auto_stories</span>
            </div>
          </div>

          {/* Barra de Distribuição Segmentada */}
          <div className="w-full h-2 rounded-full bg-surface-container flex overflow-hidden gap-0.5 mb-5">
            <div
              className="h-full bg-tertiary-container transition-all duration-700 ease-out"
              style={{ width: `${dominoPercent}%` }}
            />
            <div
              className="h-full bg-secondary-container transition-all duration-700 ease-out"
              style={{ width: `${revisarPercent}%` }}
            />
            <div
              className="h-full bg-primary-fixed-dim transition-all duration-700 ease-out"
              style={{ width: `${salvoPercent}%` }}
            />
          </div>

          {/* Lista de Rendimento */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-low">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-tertiary-fixed/40 flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-tertiary-container text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check
                  </span>
                </div>
                <span className="font-label-lg text-label-lg text-on-surface">Marcados como Dominei</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-headline-sm text-headline-sm text-tertiary-container font-bold">
                  {stats.domino}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">cards</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-low">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-secondary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-[18px]">replay</span>
                </div>
                <span className="font-label-lg text-label-lg text-on-surface">Para Revisar</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-headline-sm text-headline-sm text-secondary font-bold">
                  {stats.revisar}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">cards</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-low">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary-fixed flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-primary-container text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    bookmark
                  </span>
                </div>
                <span className="font-label-lg text-label-lg text-on-surface">Salvo para Consulta</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-headline-sm text-headline-sm text-primary-container font-bold">
                  {stats.salvo}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  {stats.salvo === 1 ? 'card' : 'cards'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Banner de Ofensiva / Gamificação */}
        <div className="flex items-center justify-between px-4 py-3.5 rounded-2xl bg-surface-container-high mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-surface-container-lowest flex items-center justify-center shadow-sm">
              <span
                className="material-symbols-outlined text-secondary-container text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_fire_department
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-primary font-bold">
                Ofensiva de {streak} {streak === 1 ? 'Dia' : 'Dias'}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Você manteve o ritmo planejado
              </span>
            </div>
          </div>
          <span className="font-label-badge text-label-badge text-secondary-container bg-surface-container-lowest px-2.5 py-1 rounded-full shadow-sm font-bold">
            +50 XP
          </span>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col gap-3 mt-auto">
          <button
            className="w-full h-[52px] rounded-2xl bg-secondary-container text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all cursor-pointer"
            type="button"
            onClick={onContinueStudying}
          >
            <span>Continuar estudando</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
          <button
            className="w-full h-[50px] rounded-2xl bg-surface-container-highest text-on-surface font-label-lg text-label-lg flex items-center justify-center active:bg-surface-dim transition-colors cursor-pointer"
            type="button"
            onClick={onBackToHome}
          >
            <span>Voltar para Hoje</span>
          </button>
        </div>
      </div>
    </main>
  );
}
