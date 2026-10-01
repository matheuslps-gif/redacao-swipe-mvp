import React, { useState, useRef, useEffect } from 'react';

export default function StudySession({
  trailName = 'Fundamentos',
  currentCard,
  nextCardItem,
  currentIndex = 0,
  totalCards = 10,
  progress = 0,
  isSaved = false,
  onSwipe, // (action: 'revisar' | 'dominei')
  onToggleSave, // (cardId)
  onClose,
  onOpenProfile,
}) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [animatingAction, setAnimatingAction] = useState(null); // 'revisar' | 'dominei'
  const [showTheoryModal, setShowTheoryModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const startXRef = useRef(0);
  const cardRef = useRef(null);

  // Garante que o estado de arrasto seja zerado ao mudar de card
  useEffect(() => {
    setDragOffset(0);
    setIsDragging(false);
    setAnimatingAction(null);
  }, [currentCard?.id]);

  // Exibe toast temporário
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Pointer / Touch drag handling
  const handlePointerDown = (e) => {
    if (animatingAction) return;
    setIsDragging(true);
    startXRef.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
  };

  const handlePointerMove = (e) => {
    if (!isDragging || animatingAction) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const diff = clientX - startXRef.current;
    setDragOffset(diff);
  };

  const handlePointerUp = () => {
    if (!isDragging || animatingAction) return;
    setIsDragging(false);

    if (dragOffset < -80) {
      triggerCardAction('revisar');
    } else if (dragOffset > 80) {
      triggerCardAction('dominei');
    } else {
      setDragOffset(0);
    }
  };

  const triggerCardAction = (action) => {
    if (animatingAction) return; // Trava contra cliques repetidos / race conditions
    setAnimatingAction(action);
    const offset = action === 'revisar' ? -380 : 380;
    setDragOffset(offset);

    setTimeout(() => {
      onSwipe?.(action);
      setDragOffset(0);
      setAnimatingAction(null);
    }, 280);
  };

  const handleSaveClick = (e) => {
    e?.stopPropagation();
    if (!currentCard) return;
    const nextSavedState = !isSaved;
    onToggleSave?.(currentCard.id);
    showToast(nextSavedState ? 'Card salvo na sua biblioteca' : 'Card removido dos salvos');
  };

  // Se não houver card ou estiver finalizando, exibe transição limpa
  if (!currentCard) {
    return (
      <div className="w-full min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-tertiary-container flex items-center justify-center text-tertiary-fixed shadow-md mb-4 animate-pulse">
          <span className="material-symbols-outlined text-[32px]">style</span>
        </div>
        <h2 className="font-headline-md text-headline-md text-primary font-bold">Finalizando rodada...</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Calculando seu progresso...</p>
      </div>
    );
  }

  // Fallback defaults se algum card não tiver certos campos
  const cardTitle = currentCard?.title || 'Conceito da Redação';
  const cardPrompt = currentCard?.cardFront || currentCard?.aulaTeoria?.slice(0, 140) || 'Dizer que um problema existe não basta. Explique por que ele acontece ou quais consequências concretas ele produz no tecido social.';
  const cardExample = currentCard?.aulaPratica || '“A negligência estatal corrobora o abandono escolar ao não destinar verbas para transporte rural.”';
  const competencyLabel = currentCard?.competency || 'Competência 3';
  const categoryLabel = currentCard?.category || trailName;

  // Cálculo de rotação e opacidades dos badges
  const rotation = dragOffset * 0.06;
  const reviewOpacity = dragOffset < -15 ? Math.min(Math.abs(dragOffset) / 80, 1) : 0;
  const masterOpacity = dragOffset > 15 ? Math.min(dragOffset / 80, 1) : 0;

  return (
    <div className="bg-surface text-on-surface antialiased flex flex-col min-h-screen">
      {/* Header Fixo */}
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="h-16 px-margin flex items-center justify-between max-w-[480px] mx-auto">
          <button
            aria-label="Fechar sessão"
            className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>

          <div className="flex flex-col items-center gap-1 flex-1 px-space-sm">
            <div className="flex items-center gap-space-sm">
              <span className="bg-primary-container text-on-primary text-label-badge font-label-badge px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {trailName.toUpperCase()}
              </span>
              <span className="text-body-sm font-body-sm text-on-surface-variant font-medium">
                {currentIndex + 1} / {totalCards}
              </span>
            </div>
            <div className="w-32 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary-container rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            aria-label="Meu Perfil"
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </button>
        </div>
      </header>

      {/* Main Flashcard Viewport */}
      <main className="flex-1 flex flex-col w-full max-w-[480px] mx-auto px-margin pt-16 pb-safe bg-surface relative">
        <div className="flex flex-col w-full py-space-sm select-none">
          {/* Toast Flutuante de Confirmação */}
          {toastMessage && (
            <div className="w-full flex justify-center py-2 relative z-30 transition-all duration-500 ease-out">
              <div className="bg-primary-container text-on-primary shadow-lg rounded-full px-4 py-2 flex items-center gap-2 max-w-fit animate-fade-in">
                <span className="material-symbols-outlined text-[18px] text-tertiary-fixed leading-none">
                  check_circle
                </span>
                <span className="font-label-md text-label-md font-semibold tracking-wide text-on-primary">
                  {toastMessage}
                </span>
                <button
                  aria-label="Fechar aviso"
                  className="ml-1 text-on-primary/70 hover:text-on-primary transition-colors flex items-center justify-center p-0.5 rounded-full cursor-pointer"
                  onClick={() => setToastMessage(null)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            </div>
          )}

          {/* Stack Container com Pilha Física 3D */}
          <div className="relative w-full flex items-center justify-center my-space-xs" style={{ minHeight: '415px' }}>
            {/* Background Card 2 (Bottom layer hint) */}
            <div className="absolute w-[86%] h-[92%] top-6 bg-surface-container-high rounded-[28px] opacity-40 shadow-sm pointer-events-none transform translate-y-2 scale-[0.96]" />

            {/* Background Card 1 (Stacked directly behind) */}
            <div className="absolute w-[93%] h-[96%] top-3 bg-surface-container rounded-[26px] opacity-85 shadow-md pointer-events-none transform translate-y-1 scale-[0.98] p-space-lg flex flex-col justify-between">
              {nextCardItem && (
                <div className="opacity-40">
                  <span className="bg-surface-container-high text-on-surface-variant font-label-badge text-label-badge px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {nextCardItem.competency || 'Próximo'}
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-primary mt-2 line-clamp-1">
                    {nextCardItem.title}
                  </h3>
                </div>
              )}
            </div>

            {/* Main Active Swipe Card */}
            <div
              ref={cardRef}
              className={`relative z-10 w-full bg-surface-container-lowest rounded-[24px] shadow-[0_12px_32px_-4px_rgba(19,62,72,0.08),0_4px_12px_-2px_rgba(19,62,72,0.04)] p-space-lg flex flex-col justify-between cursor-grab active:cursor-grabbing will-change-transform ${
                isDragging ? '' : 'transition-transform duration-200 ease-out'
              }`}
              style={{
                transform: `translateX(${dragOffset}px) rotate(${rotation}deg)`,
                touchAction: 'pan-y',
              }}
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
            >
              {/* Fita de favorito se salvo */}
              {isSaved && <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary-container rounded-t-[24px]" />}

              {/* Swipe Indicators Overlay */}
              <div
                className="absolute top-space-md left-space-md pointer-events-none transform -rotate-12 transition-opacity duration-150 z-20"
                style={{ opacity: reviewOpacity }}
              >
                <span className="bg-secondary text-on-secondary text-label-badge font-label-badge px-3 py-1.5 rounded-full uppercase tracking-widest shadow-md flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">replay</span>
                  Revisar
                </span>
              </div>

              <div
                className="absolute top-space-md right-space-md pointer-events-none transform rotate-12 transition-opacity duration-150 z-20"
                style={{ opacity: masterOpacity }}
              >
                <span className="bg-tertiary-container text-tertiary-fixed text-label-badge font-label-badge px-3 py-1.5 rounded-full uppercase tracking-widest shadow-md flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Dominei
                </span>
              </div>

              {/* Card Top Content */}
              <div className="flex flex-col gap-space-md">
                {/* Card Header Info */}
                <div className="flex items-center justify-between">
                  <span className="bg-surface-container-low text-primary-container text-label-badge font-label-badge px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-container" />
                    {categoryLabel.toUpperCase()} · CARD {String(currentIndex + 1).padStart(2, '0')}
                  </span>

                  <button
                    aria-label={isSaved ? 'Remover dos favoritos' : 'Favoritar card'}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-90 cursor-pointer ${
                      isSaved ? 'bg-primary-fixed text-primary-container' : 'bg-surface-container-low text-primary hover:bg-surface-container'
                    }`}
                    type="button"
                    onClick={handleSaveClick}
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      bookmark
                    </span>
                  </button>
                </div>

                {/* Expressive Headline */}
                <div className="pt-space-xs">
                  <h1 className="text-headline-lg-mobile font-headline-lg-mobile text-primary tracking-tight leading-snug">
                    {cardTitle}
                  </h1>
                </div>

                {/* Explanatory Analytical Body */}
                <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed line-clamp-4">
                  {cardPrompt}
                </p>

                {/* Practical Example / Micro Context Block */}
                {cardExample && (
                  <div className="bg-surface-container-low rounded-xl p-space-sm flex items-start gap-space-sm">
                    <div className="w-6 h-6 rounded-full bg-primary-fixed flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-primary text-[15px]">tips_and_updates</span>
                    </div>
                    <p className="text-body-sm font-body-sm text-on-surface-variant italic line-clamp-3">
                      {cardExample}
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-space-md mt-space-sm flex items-center justify-between">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-label-lg font-label-lg text-secondary hover:text-secondary-container transition-colors group cursor-pointer"
                  onClick={() => setShowTheoryModal(true)}
                >
                  <span>Entender melhor</span>
                  <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    north_east
                  </span>
                </button>

                <div className="flex items-center gap-1.5 text-on-surface-variant opacity-70">
                  <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                  <span className="text-label-md font-label-md uppercase tracking-wider text-[11px]">
                    deslize para classificar
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Ambient Swipe Direction Hints */}
          <div className="w-full flex items-center justify-between px-space-md text-on-surface-variant opacity-60 text-label-md font-label-md pt-space-xs pb-space-sm">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">arrow_left_alt</span>
              Arraste p/ Revisar
            </span>
            <span className="flex items-center gap-1">
              Arraste p/ Domino
              <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
            </span>
          </div>

          {/* Bottom Ergonomic Action Trio */}
          <div className="w-full bg-surface-container-lowest rounded-2xl p-space-sm shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex items-center justify-around gap-space-sm">
            {/* Action: Revisar */}
            <button
              className="flex-1 flex flex-col items-center justify-center gap-1 py-space-xs px-space-sm rounded-xl transition-all duration-150 active:scale-95 group focus:outline-none cursor-pointer"
              type="button"
              onClick={() => triggerCardAction('revisar')}
            >
              <div className="w-14 h-14 rounded-full bg-surface-container-low text-secondary flex items-center justify-center shadow-sm group-hover:bg-secondary-fixed group-active:bg-secondary-fixed transition-colors">
                <span className="material-symbols-outlined text-[26px]">history</span>
              </div>
              <span className="text-label-lg font-label-lg text-secondary tracking-tight">Revisar</span>
            </button>

            {/* Action: Salvar / Favorito */}
            <button
              className="flex flex-col items-center justify-center gap-1 py-space-xs px-space-sm rounded-xl transition-all duration-150 active:scale-95 group focus:outline-none cursor-pointer"
              type="button"
              onClick={handleSaveClick}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-colors ${
                  isSaved ? 'bg-primary-container text-on-primary' : 'bg-surface-container text-primary-container group-hover:bg-primary-fixed'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
                >
                  bookmark
                </span>
              </div>
              <span className={`text-label-md font-label-md font-medium ${isSaved ? 'text-primary-container font-bold' : 'text-on-surface-variant'}`}>
                {isSaved ? 'Salvo' : 'Salvar'}
              </span>
            </button>

            {/* Action: Domino */}
            <button
              className="flex-1 flex flex-col items-center justify-center gap-1 py-space-xs px-space-sm rounded-xl transition-all duration-150 active:scale-95 group focus:outline-none cursor-pointer"
              type="button"
              onClick={() => triggerCardAction('dominei')}
            >
              <div className="w-14 h-14 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shadow-[0_6px_16px_rgba(0,41,29,0.2)] group-hover:bg-tertiary-container group-active:bg-tertiary-container transition-colors">
                <span className="material-symbols-outlined text-[28px]">done_all</span>
              </div>
              <span className="text-label-lg font-label-lg text-tertiary tracking-tight">Domino</span>
            </button>
          </div>
        </div>
      </main>

      {/* Modal / Sheet "Entender Melhor" (Aula completa do card) */}
      {showTheoryModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-[520px] max-h-[85vh] bg-surface-container-lowest rounded-t-[28px] sm:rounded-[28px] shadow-2xl flex flex-col overflow-hidden animate-slide-up">
            {/* Modal Header */}
            <div className="p-5 border-b border-surface-container flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-label-badge text-label-badge text-secondary uppercase tracking-wider">
                  {competencyLabel} · {categoryLabel}
                </span>
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold mt-0.5">
                  {cardTitle}
                </h3>
              </div>
              <button
                type="button"
                className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
                onClick={() => setShowTheoryModal(false)}
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-left font-body-md text-body-md text-on-surface-variant">
              {/* Teoria */}
              {currentCard?.aulaTeoria && (
                <div className="space-y-2">
                  <h4 className="font-label-lg text-label-lg text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-tertiary-container">
                      school
                    </span>
                    Fundamentação Teórica
                  </h4>
                  <p className="whitespace-pre-line leading-relaxed text-on-surface">
                    {currentCard.aulaTeoria}
                  </p>
                </div>
              )}

              {/* Aplicação Prática */}
              {currentCard?.aulaPratica && (
                <div className="p-4 rounded-2xl bg-surface-container-low space-y-2">
                  <h4 className="font-label-lg text-label-lg text-secondary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">edit_note</span>
                    Aplicação na Prática (Certo x Errado)
                  </h4>
                  <p className="whitespace-pre-line text-body-sm leading-relaxed text-on-surface">
                    {currentCard.aulaPratica}
                  </p>
                </div>
              )}

              {/* Critério Oficial da Banca */}
              {currentCard?.aulaCriterio && (
                <div className="p-4 rounded-2xl bg-primary-container/10 border border-primary-container/20 space-y-1.5">
                  <h4 className="font-label-badge text-label-badge uppercase tracking-wider text-primary font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    Critério Oficial DAEB/INEP
                  </h4>
                  <p className="text-body-sm leading-relaxed text-on-surface-variant italic">
                    {currentCard.aulaCriterio}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-surface-container bg-surface-container-lowest">
              <button
                type="button"
                className="w-full h-12 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center cursor-pointer"
                onClick={() => setShowTheoryModal(false)}
              >
                Voltar ao Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
