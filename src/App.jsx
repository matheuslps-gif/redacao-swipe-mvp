import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { flashcardsData } from './data/flashcardsData';
import useFlashcards from './hooks/useFlashcards';
import useGamification from './hooks/useGamification';
import { useAuth } from './contexts/AuthContext';
import { userDataService } from './services/userDataService';
import { calculateUserAnalytics, TRAILS_METADATA, COMPETENCIES_METADATA } from './services/progressAnalytics';

import ProtectedRoute from './components/ProtectedRoute';
import BottomNavigation from './components/BottomNavigation';
import Home from './pages/Home';
import StudySession from './pages/StudySession';
import SessionCompleted from './pages/SessionCompleted';
import CardsLibrary from './pages/CardsLibrary';
import ProgressPage from './pages/ProgressPage';
import ProfilePage from './pages/ProfilePage';
import DailyGoalModal from './pages/DailyGoalModal';
import Login from './pages/Login';

// Layout que inclui a barra inferior de navegação
function MainLayout({ children, activePath }) {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(`/${path === 'hoje' ? '' : path}`);
  };

  return (
    <div className="w-full min-h-screen bg-surface font-body-md text-body-md text-on-surface antialiased">
      {children}
      <BottomNavigation activePath={activePath} onNavigate={handleNavigate} />
    </div>
  );
}

// Wrapper para a tela de estudo recebendo trailId via rota
function StudySessionRoute({
  dailyGoal,
  savedCardIds,
  userReviews,
  onToggleSaveCard,
  onSwipeAction,
  onOpenProfile,
}) {
  const { trailId: paramTrailId } = useParams();
  const navigate = useNavigate();
  const selectedTrail = paramTrailId || 'fundamentos';

  const {
    currentCard,
    nextCardItem,
    nextCard,
    isTrailFinished,
    progress,
    totalCards,
    currentIndex,
  } = useFlashcards(flashcardsData, selectedTrail, userReviews);

  const isCurrentSaved = currentCard ? savedCardIds.includes(currentCard.id) : false;

  useEffect(() => {
    if (isTrailFinished) {
      navigate('/concluido');
    }
  }, [isTrailFinished, navigate]);

  const handleSwipe = (action) => {
    if (!currentCard) return;
    // 1. Registra ação no back-end / Supabase de forma assíncrona/otimista
    onSwipeAction(action, currentCard, selectedTrail);
    // 2. Avança o estado local imediatamente para atualizar a UI do flashcard
    nextCard();
  };

  return (
    <StudySession
      trailName={currentCard?.trailName || 'Fundamentos'}
      currentCard={currentCard}
      nextCardItem={nextCardItem}
      currentIndex={currentIndex}
      totalCards={totalCards || dailyGoal}
      progress={progress}
      isSaved={isCurrentSaved}
      onSwipe={handleSwipe}
      onToggleSave={onToggleSaveCard}
      onClose={() => navigate('/')}
      onOpenProfile={onOpenProfile}
    />
  );
}

export default function App() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Lazy initializers com fallback do cache local por user_id (evita flash de dados vazios no F5)
  const [dailyGoal, setDailyGoal] = useState(() => {
    if (user?.id) {
      const cached = localStorage.getItem(`redacaoSwipeDailyGoal_${user.id}`);
      if (cached) return parseInt(cached, 10);
    }
    return 10;
  });

  const [initialFocus, setInitialFocus] = useState(() => {
    if (user?.id) {
      return localStorage.getItem(`redacaoSwipeInitialFocus_${user.id}`) || 'C1';
    }
    return 'C1';
  });

  const [savedCardIds, setSavedCardIds] = useState(() => {
    if (user?.id) {
      const cached = localStorage.getItem(`redacaoSwipeSavedCards_${user.id}`);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {}
      }
    }
    return [];
  });

  const [userReviews, setUserReviews] = useState(() => {
    if (user?.id) {
      const cached = localStorage.getItem(`redacaoSwipeReviews_${user.id}`);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {}
      }
    }
    return [];
  });

  // Estatísticas da rodada diária atual
  const [sessionStats, setSessionStats] = useState({
    domino: 0,
    revisar: 0,
    salvo: 0,
  });

  const [studiedCount, setStudiedCount] = useState(0);

  // Hook de Gamificação com isolamento por usuário
  const { streak, updateStreak } = useGamification(user?.id);

  // Carrega preferências e histórico real do usuário no Supabase
  const loadUserData = useCallback(async () => {
    if (!user?.id) return;
    try {
      const [progress, saved, reviews] = await Promise.all([
        userDataService.getUserProgress(user.id),
        userDataService.getSavedCards(user.id),
        userDataService.getUserReviews(user.id),
      ]);

      if (progress?.dailyGoal) setDailyGoal(progress.dailyGoal);
      if (progress?.initialFocus) setInitialFocus(progress.initialFocus);
      if (saved) setSavedCardIds(saved);
      if (reviews) setUserReviews(reviews);
    } catch (err) {
      console.warn('Erro ao carregar dados do usuário:', err);
    }
  }, [user?.id]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Cálculo reativo de métricas e analytics a partir dos reviews reais
  const analytics = useMemo(() => {
    return calculateUserAnalytics(userReviews);
  }, [userReviews]);

  // Trilha ativa sugerida (com base no menor domínio iniciado, foco inicial ou primeira trilha)
  const activeTrail = useMemo(() => {
    const inProgress = analytics.trails.find((t) => t.mastery > 0 && t.mastery < 100);
    if (inProgress) return inProgress;

    if (initialFocus) {
      const focusComp = COMPETENCIES_METADATA.find((c) => c.key === initialFocus);
      if (focusComp) {
        const matchingTrail = analytics.trails.find((t) => t.id === focusComp.trailId);
        if (matchingTrail) return matchingTrail;
      }
    }

    return analytics.trails[0] || TRAILS_METADATA[0];
  }, [analytics.trails, initialFocus]);

  // Toggle de salvar card
  const handleToggleSaveCard = (cardId) => {
    if (!cardId) return;
    const isCurrentlySaved = savedCardIds.includes(cardId);
    if (!isCurrentlySaved) {
      setSessionStats((s) => ({ ...s, salvo: s.salvo + 1 }));
    }

    setSavedCardIds((prev) =>
      isCurrentlySaved ? prev.filter((id) => id !== cardId) : [...prev, cardId]
    );

    if (user?.id) {
      userDataService.toggleSavedCard(user.id, cardId, isCurrentlySaved);
    }
  };

  // Processa Swipe / Classificação do card
  const handleSwipeAction = (action, card, trailId) => {
    if (action === 'dominei') {
      setSessionStats((s) => ({ ...s, domino: s.domino + 1 }));
    } else if (action === 'revisar') {
      setSessionStats((s) => ({ ...s, revisar: s.revisar + 1 }));
    }

    if (user?.id && card?.id) {
      userDataService.recordCardReview(user.id, card.id, trailId, action);
      // Atualiza reativamente os reviews no estado deduplicando por card_id
      setUserReviews((prev) => {
        const filtered = prev.filter((r) => r.card_id !== card.id);
        return [
          ...filtered,
          { card_id: card.id, trail_id: trailId, action, created_at: new Date().toISOString() },
        ];
      });
    }

    // Registra atividade do dia e atualiza ofensiva no Supabase
    updateStreak();

    const nextCount = studiedCount + 1;
    setStudiedCount(nextCount);

    if (nextCount >= dailyGoal) {
      navigate('/concluido');
    }
  };

  // Salva nova meta diária
  const handleSaveDailyGoal = (newGoal) => {
    setDailyGoal(newGoal);
    if (user?.id) {
      userDataService.saveDailyGoal(user.id, newGoal);
    }
    navigate('/');
  };

  // Salva foco inicial escolhido no Zero State
  const handleSaveInitialFocus = (focusKey) => {
    setInitialFocus(focusKey);
    if (user?.id) {
      userDataService.saveInitialFocus(user.id, focusKey);
    }
  };

  // Logout seguro
  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Estudante';

  return (
    <Routes>
      {/* Rota Pública de Login / Cadastro */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login onBack={() => navigate('/')} />}
      />

      {/* Rotas Protegidas (Exigem Sessão Ativa) */}
      <Route element={<ProtectedRoute />}>
        {/* Aba Hoje (Home) com Métricas Reais */}
        <Route
          path="/"
          element={
            <MainLayout activePath="hoje">
              <Home
                userName={userName}
                streak={streak}
                dailyGoal={dailyGoal}
                studiedCount={studiedCount}
                enemScore={analytics.enemScore}
                revisarCount={analytics.revisarCount}
                stats={sessionStats}
                activeTrail={activeTrail}
                onStartStudy={() => navigate(`/estudo/${activeTrail?.id || 'fundamentos'}`)}
                onNavigate={(tab) => navigate(`/${tab === 'hoje' ? '' : tab}`)}
                onOpenProfile={() => navigate('/perfil')}
              />
            </MainLayout>
          }
        />

        <Route
          path="/hoje"
          element={<Navigate to="/" replace />}
        />

        {/* Aba Cards (Biblioteca com Métricas Reais de Trilhas e Cards Salvos) */}
        <Route
          path="/cards"
          element={
            <MainLayout activePath="cards">
              <CardsLibrary
                trails={analytics.trails}
                savedCardIds={savedCardIds}
                passingTrailsCount={analytics.passingTrailsCount}
                onSelectTrail={(trailId) => navigate(`/estudo/${trailId}`)}
                onToggleSaveCard={handleToggleSaveCard}
                onStartReviewSaved={() => {
                  if (savedCardIds.length > 0) navigate('/estudo/fundamentos');
                }}
                onOpenProfile={() => navigate('/perfil')}
              />
            </MainLayout>
          }
        />

        {/* Aba Progresso com Anel e Competências Dinâmicas */}
        <Route
          path="/progresso"
          element={
            <MainLayout activePath="progresso">
              <ProgressPage
                streak={streak}
                stats={{
                  domino: analytics.dominoCount,
                  revisar: analytics.revisarCount,
                  novos: analytics.novosCount,
                  globalMasteryPercent: analytics.globalMasteryPercent,
                  totalCards: analytics.totalCardsGlobal,
                }}
                totalStudied={analytics.totalStudied}
                competencies={analytics.competencies}
                priorityCompetency={analytics.priorityCompetency}
                initialFocus={initialFocus}
                onSaveInitialFocus={handleSaveInitialFocus}
                onOpenProfile={() => navigate('/perfil')}
                onStartStudy={(trailId) =>
                  navigate(`/estudo/${trailId || activeTrail?.id || 'fundamentos'}`)
                }
              />
            </MainLayout>
          }
        />

        {/* Aba Perfil com Dados Reais */}
        <Route
          path="/perfil"
          element={
            <MainLayout activePath="perfil">
              <ProfilePage
                userName={userName}
                streak={streak}
                dailyGoal={dailyGoal}
                savedCount={savedCardIds.length}
                onChangeGoal={() => navigate('/meta-diaria')}
                onLogout={handleLogout}
              />
            </MainLayout>
          }
        />

        {/* Tela de Estudo / Sessão de Flashcards */}
        <Route
          path="/estudo"
          element={
            <StudySessionRoute
              dailyGoal={dailyGoal}
              savedCardIds={savedCardIds}
              userReviews={userReviews}
              onToggleSaveCard={handleToggleSaveCard}
              onSwipeAction={handleSwipeAction}
              onOpenProfile={() => navigate('/perfil')}
            />
          }
        />

        <Route
          path="/estudo/:trailId"
          element={
            <StudySessionRoute
              dailyGoal={dailyGoal}
              savedCardIds={savedCardIds}
              userReviews={userReviews}
              onToggleSaveCard={handleToggleSaveCard}
              onSwipeAction={handleSwipeAction}
              onOpenProfile={() => navigate('/perfil')}
            />
          }
        />

        {/* Tela de Meta Concluída */}
        <Route
          path="/concluido"
          element={
            <SessionCompleted
              streak={streak}
              stats={sessionStats}
              totalStudied={studiedCount}
              onContinueStudying={() => navigate('/estudo/argumentacao')}
              onBackToHome={() => navigate('/')}
            />
          }
        />

        {/* Tela de Configuração de Meta Diária */}
        <Route
          path="/meta-diaria"
          element={
            <DailyGoalModal
              currentGoal={dailyGoal}
              onSaveGoal={handleSaveDailyGoal}
              onBack={() => navigate(-1)}
            />
          }
        />
      </Route>

      {/* Fallback para rotas desconhecidas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
