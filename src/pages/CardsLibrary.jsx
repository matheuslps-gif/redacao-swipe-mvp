import React, { useState } from 'react';
import { flashcardsData } from '../data/flashcardsData';

// Configuração visual pedagógica das 7 trilhas ENEM
const trailsConfig = [
  {
    id: 'fundamentos',
    number: 1,
    name: 'Fundamentos',
    subtitle: '18 cards · Estrutura ENEM',
    tag: 'Consolidado',
    tagClass: 'bg-tertiary-fixed/40 text-on-tertiary-fixed-variant',
    mastery: 92,
    barColor: 'bg-tertiary-container',
    numColor: 'bg-tertiary-fixed/30 text-on-tertiary-fixed-variant',
    icon: 'verified',
    iconColor: 'text-on-tertiary-fixed-variant',
  },
  {
    id: 'introducao',
    number: 2,
    name: 'Introdução',
    subtitle: '24 cards · Contexto & Tese',
    tag: null,
    mastery: 82,
    barColor: 'bg-primary-container',
    numColor: 'bg-primary-fixed/40 text-on-primary-fixed-variant',
    icon: 'check_circle',
    iconColor: 'text-primary',
  },
  {
    id: 'argumentacao',
    number: 3,
    name: 'Argumentação',
    subtitle: '32 cards · Estratégia dissertativa',
    tag: 'Em progresso',
    tagClass: 'bg-surface-container text-on-surface-variant',
    mastery: 63,
    barColor: 'bg-primary-container',
    numColor: 'bg-primary-fixed/40 text-on-primary-fixed-variant',
    icon: 'trending_up',
    iconColor: 'text-on-surface-variant',
  },
  {
    id: 'repertorio',
    number: 4,
    name: 'Repertório',
    subtitle: '28 cards · Legitimado & Produtivo',
    tag: null,
    mastery: 71,
    barColor: 'bg-primary-container',
    numColor: 'bg-primary-fixed/40 text-on-primary-fixed-variant',
    icon: 'history_edu',
    iconColor: 'text-on-surface-variant',
  },
  {
    id: 'coesao',
    number: 5,
    name: 'Coesão',
    subtitle: '20 cards · Conectivos inter e intra',
    tag: null,
    mastery: 58,
    barColor: 'bg-primary-container',
    numColor: 'bg-primary-fixed/40 text-on-primary-fixed-variant',
    icon: 'link',
    iconColor: 'text-on-surface-variant',
  },
  {
    id: 'proposta',
    number: 6,
    name: 'Proposta de Intervenção',
    subtitle: '26 cards · 5 elementos obrigatórios',
    tag: 'Ponto de atenção',
    tagClass: 'bg-secondary-fixed text-on-secondary-fixed-variant',
    tagIcon: 'priority_high',
    mastery: 44,
    barColor: 'bg-secondary-container',
    numColor: 'bg-secondary-fixed text-on-secondary-fixed-variant',
    icon: 'warning',
    iconColor: 'text-secondary',
    highlightContainer: 'bg-secondary-fixed/20',
  },
  {
    id: 'conclusao',
    number: 7,
    name: 'Conclusão',
    subtitle: '14 cards · Retomada de tese',
    tag: 'Não iniciado',
    tagClass: 'bg-surface-container text-on-surface-variant',
    mastery: 0,
    barColor: 'bg-outline-variant',
    numColor: 'bg-surface-container text-on-surface-variant',
    icon: 'play_circle',
    iconColor: 'text-outline',
  },
];

export default function CardsLibrary({
  savedCardIds = [],
  onSelectTrail,
  onToggleSaveCard,
  onStartReviewSaved,
  onOpenProfile,
}) {
  const [activeTab, setActiveTab] = useState('trilhas'); // 'trilhas' | 'salvos'
  const [toastMessage, setToastMessage] = useState(null);
  const [isWiggling, setIsWiggling] = useState(false);

  // Filtra cards salvos pelo array de IDs
  const savedCards = flashcardsData.filter((card) => savedCardIds.includes(card.id));

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  const handleBookmarkToggle = (card) => {
    onToggleSaveCard?.(card.id);
    const willBeSaved = !savedCardIds.includes(card.id);
    showToast(willBeSaved ? 'Card guardado nos salvos' : 'Card removido dos salvos');
  };

  const triggerEmptyWiggle = () => {
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 400);
  };

  return (
    <div className="bg-surface text-on-surface antialiased flex flex-col min-h-screen">
      {/* Header Fixo */}
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="max-w-[480px] mx-auto h-16 px-margin flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-[24px]">auto_stories</span>
            <h1 className="font-headline-md text-headline-md text-primary tracking-tight font-bold">
              Cards
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
        <div className="flex flex-col w-full pb-6">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-primary text-on-primary px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 transition-all duration-300 animate-fade-in">
              <span className="material-symbols-outlined text-[18px] text-tertiary-fixed">
                check_circle
              </span>
              <span className="font-label-md text-label-md">{toastMessage}</span>
            </div>
          )}

          {/* Segmented Tabs (Trilhas vs Salvos) */}
          <div className="w-full pt-1 pb-4">
            <div className="bg-surface-container p-1 rounded-xl flex items-center justify-between shadow-sm">
              <button
                className={`flex-1 py-2 px-3 rounded-lg font-label-lg text-label-lg transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'trilhas'
                    ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
                onClick={() => setActiveTab('trilhas')}
              >
                <span className="material-symbols-outlined text-[18px]">alt_route</span>
                <span>
                  Trilhas <span className="font-label-badge text-label-badge opacity-80">(7)</span>
                </span>
              </button>

              <button
                className={`flex-1 py-2 px-3 rounded-lg font-label-lg text-label-lg transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'salvos'
                    ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
                onClick={() => setActiveTab('salvos')}
              >
                <span
                  className="material-symbols-outlined text-[18px] text-secondary"
                  style={{ fontVariationSettings: activeTab === 'salvos' ? "'FILL' 1" : "'FILL' 0" }}
                >
                  bookmark
                </span>
                <span>
                  Salvos{' '}
                  <span className="bg-secondary-fixed text-on-secondary-fixed text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {savedCards.length}
                  </span>
                </span>
              </button>
            </div>
          </div>

          {/* ABA TRILHAS (Tela 11) */}
          {activeTab === 'trilhas' && (
            <div className="flex flex-col gap-3 animate-fade-in" id="content-trilhas">
              {/* Motivational Banner */}
              <div className="mb-2 p-3.5 bg-primary-container rounded-2xl flex items-center gap-3 text-on-primary shadow-sm relative overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-on-primary-container/20 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary-fixed text-[20px]">
                    auto_awesome
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-headline-sm text-headline-sm text-primary-fixed leading-tight font-bold">
                    Mastery ENEM 2026
                  </p>
                  <p className="font-body-sm text-body-sm text-on-primary-container opacity-90 truncate">
                    5 de 7 trilhas em ritmo de aprovação (Nota 900+)
                  </p>
                </div>
                <div className="flex items-center text-primary-fixed pl-1">
                  <span className="material-symbols-outlined text-[20px]">insights</span>
                </div>
              </div>

              {/* Lista das 7 Trilhas */}
              {trailsConfig.map((t) => (
                <div
                  key={t.id}
                  className="group relative flex flex-col p-4 bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.99] text-left cursor-pointer"
                  onClick={() => onSelectTrail?.(t.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-headline-sm text-headline-sm font-bold flex-shrink-0 ${t.numColor}`}
                      >
                        {t.number}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                            {t.name}
                          </h2>
                          {t.tag && (
                            <span
                              className={`px-2 py-0.5 rounded-full font-label-badge text-label-badge uppercase flex items-center gap-1 ${t.tagClass}`}
                            >
                              {t.tagIcon && (
                                <span className="material-symbols-outlined text-[11px]">
                                  {t.tagIcon}
                                </span>
                              )}
                              {t.tag}
                            </span>
                          )}
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                          {t.subtitle}
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors text-[22px] mt-1">
                      chevron_right
                    </span>
                  </div>

                  <div
                    className={`mt-3.5 pt-3 flex items-center justify-between gap-3 rounded-xl p-2.5 ${
                      t.highlightContainer || 'bg-surface-container-low/60'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-label-md text-label-md text-on-surface-variant">
                          Domínio da trilha
                        </span>
                        <span
                          className={`font-label-md text-label-md font-bold ${
                            t.mastery > 70
                              ? 'text-on-tertiary-fixed-variant'
                              : t.mastery > 0
                              ? 'text-primary'
                              : 'text-on-surface-variant'
                          }`}
                        >
                          {t.mastery}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${t.barColor}`}
                          style={{ width: `${t.mastery}%` }}
                        />
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 ${t.iconColor}`}>
                      <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Botão de Estudo Rápido */}
              <div className="mt-4 flex flex-col items-center">
                <button
                  type="button"
                  className="w-full py-3.5 px-6 bg-secondary-container text-on-secondary rounded-2xl font-label-lg text-label-lg shadow-md hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  onClick={() => onSelectTrail?.('argumentacao')}
                >
                  <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                  <span>Continuar Trilha: Argumentação</span>
                </button>
                <p className="font-label-md text-label-md text-on-surface-variant mt-2 text-center">
                  Faltam cards para a meta do dia
                </p>
              </div>
            </div>
          )}

          {/* ABA SALVOS (Telas 12 e 13) */}
          {activeTab === 'salvos' && (
            <div className="flex flex-col gap-3.5 animate-fade-in" id="content-salvos">
              {savedCards.length > 0 ? (
                /* Tela 12 — Biblioteca com Cards Salvos */
                <>
                  <div className="flex items-center justify-between px-1 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-headline-sm text-headline-sm text-primary font-bold">
                        Sua Curadoria
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    </div>
                    <span className="font-label-badge text-label-badge text-on-surface-variant uppercase tracking-wider">
                      ENEM 2026
                    </span>
                  </div>

                  {savedCards.map((card) => (
                    <article
                      key={card.id}
                      className="saved-card group relative bg-surface-container-lowest rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden text-left"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full font-label-badge text-label-badge bg-primary-container text-on-primary-container tracking-wider uppercase">
                          {card.category || card.trailName || 'CONCEITO'}
                        </span>
                        <button
                          aria-label="Remover dos salvos"
                          className="bookmark-btn p-1.5 -mr-1.5 -mt-1 rounded-full text-secondary hover:bg-secondary-fixed/30 active:scale-90 transition-transform cursor-pointer"
                          type="button"
                          onClick={() => handleBookmarkToggle(card)}
                        >
                          <span
                            className="material-symbols-outlined text-[22px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            bookmark
                          </span>
                        </button>
                      </div>

                      <h2 className="font-headline-sm text-headline-sm text-primary mb-2 tracking-tight group-hover:text-secondary transition-colors font-bold">
                        {card.title}
                      </h2>

                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed line-clamp-3">
                        {card.cardFront || card.aulaTeoria?.slice(0, 140)}
                      </p>

                      <div className="mt-4 pt-3 flex items-center justify-between border-t border-surface-container-low">
                        <span className="font-label-md text-label-md text-outline flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">psychology</span>
                          {card.competency}
                        </span>
                        <button
                          type="button"
                          className="font-label-md text-label-md text-primary font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform cursor-pointer"
                          onClick={() => onSelectTrail?.(card.trailId)}
                        >
                          Ver modelo prático
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                      </div>
                    </article>
                  ))}

                  {/* Banner de Fixação Espaçada */}
                  <div className="w-full bg-surface-container-low rounded-2xl p-4 my-2 flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">lightbulb</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-label-lg text-label-lg text-primary font-bold">
                        Fixação Espaçada Ativa
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        Cards salvos entram na sua rodada de reforço cognitivo diário para garantir
                        retenção até o dia da prova.
                      </p>
                    </div>
                  </div>

                  {/* Botão de Revisão de Salvos */}
                  <div className="sticky bottom-20 w-full pt-1 pb-2">
                    <button
                      className="w-full h-14 bg-primary text-on-primary rounded-2xl font-label-lg text-label-lg tracking-wide shadow-lg flex items-center justify-center gap-2 hover:bg-primary-container active:scale-[0.98] transition-all duration-200 cursor-pointer"
                      type="button"
                      onClick={onStartReviewSaved}
                    >
                      <span className="material-symbols-outlined text-[20px] text-tertiary-fixed">
                        play_lesson
                      </span>
                      <span>Revisar cards salvos</span>
                      <span className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full text-xs font-bold">
                        {savedCards.length}
                      </span>
                    </button>
                  </div>
                </>
              ) : (
                /* Tela 13 — Salvos Vazios (Empty State) */
                <div className="flex flex-col items-center justify-center text-center px-4 py-8 mt-2">
                  <div
                    className="relative flex items-center justify-center mb-6 group cursor-pointer"
                    onClick={triggerEmptyWiggle}
                  >
                    <div className="absolute w-28 h-28 rounded-full bg-primary-fixed/40 blur-xl transition-all duration-500 group-hover:scale-110" />
                    <div
                      className={`relative w-20 h-20 rounded-full bg-surface-container-low shadow-sm flex items-center justify-center transition-transform duration-300 ease-out ${
                        isWiggling ? '-rotate-12 scale-110' : ''
                      }`}
                    >
                      <div className="w-14 h-14 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-[0_2px_8px_rgba(19,62,72,0.06)]">
                        <span
                          className="material-symbols-outlined text-[30px] text-primary"
                          style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}
                        >
                          bookmark_add
                        </span>
                      </div>
                    </div>
                  </div>

                  <h2 className="font-headline-md text-headline-md text-primary font-bold tracking-tight mb-2">
                    Nenhum card salvo ainda
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-[280px] leading-relaxed mb-8">
                    Guarde aqui as ideias que você quer consultar antes de escrever.
                  </p>

                  <button
                    className="w-full max-w-[260px] h-[52px] rounded-xl bg-secondary-container text-on-secondary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200 cursor-pointer"
                    type="button"
                    onClick={() => setActiveTab('trilhas')}
                  >
                    <span>Explorar cards agora</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>

                  <div className="mt-8 p-4 rounded-xl bg-surface-container-low flex items-start gap-3 text-left">
                    <div className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center flex-shrink-0 text-primary-container shadow-xs">
                      <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider mb-0.5">
                        Dica de Redação
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                        Toque no ícone de marcador no canto superior dos cards para montar sua colagem de
                        repertórios nota 1000.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
