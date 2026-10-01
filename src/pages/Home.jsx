import React from 'react';

export default function Home({
  userName = 'Lucas',
  streak = 0,
  dailyGoal = 10,
  studiedCount = 0,
  enemScore = 0,
  revisarCount = 0,
  stats = { domino: 0, revisar: 0, salvo: 0 },
  activeTrail = { id: 'fundamentos', name: 'Fundamentos', competency: 'Estrutura Geral', description: 'Regras da banca e critérios de anulação', mastery: 0 },
  nextCardTitle = 'Regras essenciais da redação ENEM',
  dateLabel = 'Hoje',
  onStartStudy,
  onNavigate,
  onOpenProfile,
}) {
  const isSessionInProgress = studiedCount > 0;
  const progressPercent = Math.min(100, Math.round((studiedCount / dailyGoal) * 100));
  const remainingCards = Math.max(0, dailyGoal - studiedCount);
  const remainingMinutes = Math.max(1, Math.ceil(remainingCards * 0.5));

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen">
      {/* Header Fixo */}
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="max-w-[480px] mx-auto h-16 px-margin flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary-container text-[20px]">
                menu_book
              </span>
            </div>
            <h1 className="font-headline-md text-headline-md text-primary tracking-tight font-bold">
              Hoje
            </h1>
          </div>
          <button
            type="button"
            aria-label="Meu Perfil"
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm hover:opacity-95 transition-opacity cursor-pointer"
          >
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-col relative w-full max-w-[480px] mx-auto pt-16 pb-24 px-margin bg-surface">
        <div className="flex flex-col w-full gap-space-lg">
          {/* Saudação e Ofensiva Header */}
          <section className="flex items-center justify-between pt-space-xs">
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                {dateLabel}
              </span>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mt-space-xs tracking-tight">
                {isSessionInProgress ? `Quase lá, ${userName}!` : `Bom dia, ${userName}`}
              </h2>
            </div>

            {isSessionInProgress || streak > 0 ? (
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center shadow-sm relative">
                <span className="material-symbols-outlined text-secondary text-[26px]">
                  local_fire_department
                </span>
                {streak > 0 && (
                  <>
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full animate-ping" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full" />
                  </>
                )}
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm">
                <span className="font-headline-sm text-headline-sm font-bold">
                  {userName.charAt(0)}
                </span>
              </div>
            )}
          </section>

          {/* Card Principal: Meta do Dia / Sessão Ativa */}
          {isSessionInProgress ? (
            /* Tela 04 — Sessão em Andamento */
            <section className="w-full bg-surface-container-lowest rounded-xl p-space-lg shadow-md flex flex-col relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br from-primary-fixed/30 to-secondary-fixed/20 pointer-events-none blur-xl" />
              <div className="flex items-center justify-between z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed">
                  <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse" />
                  <span className="font-label-badge text-label-badge uppercase tracking-widest">
                    Sessão Ativa
                  </span>
                </div>
                <span className="font-label-md text-label-md text-primary font-bold bg-surface-container-low px-2.5 py-1 rounded-full">
                  {progressPercent}% concluído
                </span>
              </div>

              <div className="mt-space-md z-10 flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="font-display-mobile text-display-mobile text-primary tracking-tight">
                    {studiedCount}
                  </span>
                  <span className="font-headline-md text-headline-md text-on-surface-variant font-medium">
                    / {dailyGoal} cards
                  </span>
                </div>
                <div className="w-full h-3 bg-surface-container-high rounded-full mt-3 overflow-hidden p-0.5 flex items-center">
                  <div
                    className="h-full bg-gradient-to-r from-primary-container via-tertiary-container to-tertiary-fixed-dim rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                  Faltam apenas {remainingCards} {remainingCards === 1 ? 'card' : 'cards'} (~{remainingMinutes} min restante)
                </p>
              </div>

              <button
                className="mt-space-lg w-full h-[52px] bg-secondary-container text-on-secondary rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform z-10 cursor-pointer"
                id="cta-continue"
                type="button"
                onClick={onStartStudy}
              >
                <span>Continuar aprendendo</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </section>
          ) : (
            /* Tela 03 — Antes de Estudar */
            <section className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-lg shadow-md flex flex-col gap-space-md">
              <div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-secondary-container/10 blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span
                    className="material-symbols-outlined text-secondary-container text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    local_fire_department
                  </span>
                  <span className="font-label-badge text-label-badge uppercase tracking-wider text-secondary">
                    Meta do Dia
                  </span>
                </div>
                <span className="font-label-badge text-label-badge px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-bold">
                  0% CONCLUÍDO
                </span>
              </div>

              <div className="flex flex-col gap-space-xs">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display-mobile text-display-mobile text-primary font-extrabold">
                      0
                    </span>
                    <span className="font-headline-sm text-headline-sm text-on-surface-variant">
                      / {dailyGoal} cards
                    </span>
                  </div>
                  <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                    ~{Math.ceil(dailyGoal * 0.6)} min estimados
                  </span>
                </div>

                <div className="w-full h-2.5 rounded-full bg-surface-container overflow-hidden p-0.5">
                  <div className="h-full rounded-full bg-secondary-container transition-all duration-700 w-0" />
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Inicie para manter sua sequência diária ativa e fixar novos repertórios.
                </p>
              </div>

              <button
                className="w-full h-14 rounded-xl bg-secondary-container text-on-secondary flex items-center justify-center gap-space-sm shadow-md active:scale-[0.98] transition-transform duration-150 cursor-pointer"
                id="btn-start-study"
                type="button"
                onClick={onStartStudy}
              >
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  play_arrow
                </span>
                <span className="font-label-lg text-label-lg font-bold tracking-wide uppercase">
                  Começar a aprender
                </span>
              </button>
            </section>
          )}

          {/* Grid de Sequência & Domínio Dinâmico */}
          {!isSessionInProgress && (
            <div className="grid grid-cols-2 gap-space-sm">
              <div className="flex items-center gap-space-sm p-space-md rounded-xl bg-surface-container-low shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    bolt
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-md text-label-md text-on-surface-variant">Sequência</span>
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">
                    {streak} {streak === 1 ? 'dia' : 'dias'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-space-sm p-space-md rounded-xl bg-surface-container-low shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[20px]">military_tech</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-md text-label-md text-on-surface-variant">Domínio ENEM</span>
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">
                    {enemScore} pts
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Seu Foco Atual */}
          <section className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-label-badge text-label-badge text-on-surface-variant uppercase tracking-widest">
                Seu Foco Atual
              </h3>
              <span className="font-label-md text-label-md text-secondary font-semibold">
                {activeTrail.competency}
              </span>
            </div>

            <div
              className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
              onClick={onStartStudy}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[22px]">gavel</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <h4 className="font-headline-sm text-headline-sm text-primary truncate">
                    {activeTrail.name}
                  </h4>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {activeTrail.description}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0 pl-2">
                <span className="font-label-lg text-label-lg text-secondary font-bold">
                  {activeTrail.mastery || 0}%
                </span>
                <span className="font-label-badge text-label-badge text-on-surface-variant uppercase">
                  domínio
                </span>
              </div>
            </div>
          </section>

          {/* Balanço do Momento (Se sessão em andamento) OU Rotina Recomendada (Antes de estudar) */}
          {isSessionInProgress ? (
            <>
              <section className="flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-label-badge text-label-badge text-on-surface-variant uppercase tracking-widest">
                    Balanço do Momento
                  </h3>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {studiedCount} revisados
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-space-sm">
                  <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col items-center justify-center py-3.5 relative overflow-hidden">
                    <div className="w-2 h-2 rounded-full bg-tertiary-container absolute top-2 right-2" />
                    <span className="font-display-mobile text-[26px] leading-none text-tertiary-container font-extrabold">
                      {stats.domino || 0}
                    </span>
                    <span className="font-label-md text-label-md text-tertiary-container mt-1 font-semibold">
                      Domino
                    </span>
                  </div>

                  <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col items-center justify-center py-3.5 relative overflow-hidden">
                    <div className="w-2 h-2 rounded-full bg-secondary absolute top-2 right-2" />
                    <span className="font-display-mobile text-[26px] leading-none text-secondary font-extrabold">
                      {stats.revisar || 0}
                    </span>
                    <span className="font-label-md text-label-md text-secondary mt-1 font-semibold">
                      Revisar
                    </span>
                  </div>

                  <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col items-center justify-center py-3.5 relative overflow-hidden">
                    <div className="w-2 h-2 rounded-full bg-primary-container absolute top-2 right-2" />
                    <span className="font-display-mobile text-[26px] leading-none text-primary-container font-extrabold">
                      {stats.salvo || 0}
                    </span>
                    <span className="font-label-md text-label-md text-primary-container mt-1 font-semibold">
                      Salvo
                    </span>
                  </div>
                </div>
              </section>

              {/* Próximo Card */}
              <section
                className="w-full bg-surface-container-low rounded-xl p-space-md flex items-center justify-between shadow-sm cursor-pointer hover:bg-surface-container transition-colors"
                onClick={onStartStudy}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                    <span className="material-symbols-outlined text-[20px]">psychology</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-primary">Próximo Card</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {nextCardTitle}
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline-variant">navigate_next</span>
              </section>
            </>
          ) : (
            /* Tela 03 — Rotina Recomendada */
            <section className="flex flex-col gap-space-sm">
              <span className="font-label-badge text-label-badge uppercase tracking-wider text-on-surface-variant px-1">
                Sua Rotina Recomendada
              </span>

              <div className="p-space-lg rounded-xl bg-surface-container-low shadow-sm flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs text-secondary">
                    <span className="material-symbols-outlined text-[20px]">history</span>
                    <span className="font-label-badge text-label-badge uppercase tracking-wider font-bold">
                      Repetição Espaçada
                    </span>
                  </div>
                  <span className="font-label-badge text-label-badge px-2 py-0.5 rounded-full bg-surface-container-highest text-secondary font-bold">
                    {revisarCount} {revisarCount === 1 ? 'card' : 'cards'}
                  </span>
                </div>

                <div className="flex flex-col">
                  <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                    {revisarCount > 0
                      ? `${revisarCount} cards aguardam revisão`
                      : 'Nenhum card pendente de revisão'}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    {revisarCount > 0
                      ? 'Revisitar consolida a memória de longo prazo antes que os conceitos comecem a desvanecer.'
                      : 'Inicie uma sessão para estudar cards inéditos e desbloquear sua repetição espaçada.'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-space-xs">
                  <div className="flex -space-x-2 overflow-hidden">
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary font-label-badge">
                      C1
                    </div>
                    <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-on-secondary font-label-badge">
                      C3
                    </div>
                    <div className="w-7 h-7 rounded-full bg-tertiary flex items-center justify-center text-on-tertiary font-label-badge">
                      C4
                    </div>
                  </div>
                  <button
                    className="font-label-md text-label-md text-secondary font-bold flex items-center gap-1 cursor-pointer"
                    type="button"
                    onClick={() => onNavigate?.('cards')}
                  >
                    {revisarCount > 0 ? 'Revisar agora' : 'Ver trilhas'}
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
