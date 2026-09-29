import React from 'react';

export default function ProfilePage({
  userName = 'Lucas',
  streak = 5,
  dailyGoal = 10,
  savedCount = 3,
  onChangeGoal,
  onLogout,
}) {
  return (
    <div className="bg-surface text-on-surface antialiased flex flex-col min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="max-w-[480px] mx-auto h-16 px-margin flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-[24px]">account_circle</span>
            <h1 className="font-headline-md text-headline-md text-primary tracking-tight font-bold">
              Perfil
            </h1>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col w-full max-w-[480px] mx-auto px-margin pt-16 pb-24 bg-surface relative">
        <div className="flex flex-col w-full pb-6 space-y-4">
          {/* Card do Usuário */}
          <section className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-2xl font-bold shadow-md">
              {userName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-headline-md text-headline-md text-primary font-bold truncate">
                {userName}
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Foco: Nota 900+ no ENEM
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
                  PLANO PRO
                </span>
                <span className="text-[11px] text-on-surface-variant">Membro ativo</span>
              </div>
            </div>
          </section>

          {/* Grid de Ofensiva & Metas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-secondary">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  local_fire_department
                </span>
                <span className="font-label-badge text-label-badge uppercase">Ofensiva</span>
              </div>
              <span className="font-display-mobile text-display-mobile text-primary font-extrabold">
                {streak}
              </span>
              <span className="text-body-sm text-on-surface-variant">dias consecutivos</span>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-primary-container">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  bookmark
                </span>
                <span className="font-label-badge text-label-badge uppercase">Salvos</span>
              </div>
              <span className="font-display-mobile text-display-mobile text-primary font-extrabold">
                {savedCount}
              </span>
              <span className="text-body-sm text-on-surface-variant">cards guardados</span>
            </div>
          </div>

          {/* Configurações de Estudo */}
          <section className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-label-badge text-label-badge uppercase tracking-wider text-on-surface-variant">
              Preferências de Estudo
            </h3>

            <div
              className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer"
              onClick={onChangeGoal}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">timer</span>
                </div>
                <div>
                  <p className="font-label-lg text-label-lg text-primary">Meta Diária</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {dailyGoal} cards por dia (~{Math.ceil(dailyGoal * 0.5)} min)
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline">chevron_right</span>
            </div>
          </section>

          {/* Ações de Conta */}
          <section className="pt-4">
            <button
              type="button"
              className="w-full h-12 rounded-xl bg-surface-container-high text-error font-label-lg text-label-lg flex items-center justify-center gap-2 active:bg-surface-dim transition-colors cursor-pointer"
              onClick={onLogout}
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span>Sair da conta</span>
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
