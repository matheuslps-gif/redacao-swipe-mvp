import React, { useState, useEffect } from 'react';
import { flashcardsData } from './data/flashcardsData';
import useFlashcards from './hooks/useFlashcards';
import useGamification from './hooks/useGamification';

import BottomNavigation from './components/BottomNavigation';
import Home from './pages/Home';
import StudySession from './pages/StudySession';
import SessionCompleted from './pages/SessionCompleted';
import CardsLibrary from './pages/CardsLibrary';
import ProgressPage from './pages/ProgressPage';
import ProfilePage from './pages/ProfilePage';
import DailyGoalModal from './pages/DailyGoalModal';
import Login from './pages/Login';

export default function App() {
  // Autenticação mock / estado de usuário
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('redacaoSwipeUser');
    return saved ? JSON.parse(saved) : { name: 'Lucas', email: 'lucas@exemplo.com' };
  });

  // Meta diária (5, 10, 15, 20 cards)
  const [dailyGoal, setDailyGoal] = useState(() => {
    const saved = localStorage.getItem('redacaoSwipeDailyGoal');
    return saved ? parseInt(saved, 10) : 10;
  });

  // Cards salvos / favoritos
  const [savedCardIds, setSavedCardIds] = useState(() => {
    const saved = localStorage.getItem('redacaoSwipeSavedCards');
    return saved ? JSON.parse(saved) : ['fund-01', 'fund-02', 'intro-01'];
  });

  // Trilha de estudo selecionada
  const [selectedTrailId, setSelectedTrailId] = useState('fundamentos');

  // Navegação de abas e telas ('hoje' | 'cards' | 'progresso' | 'perfil' | 'study' | 'completed' | 'goal_setup' | 'login')
  const [activeTab, setActiveTab] = useState('hoje');
  const [currentScreen, setCurrentScreen] = useState('main'); // 'main' | 'study' | 'completed' | 'goal_setup' | 'login'

  // Estatísticas da rodada diária
  const [sessionStats, setSessionStats] = useState({
    domino: 0,
    revisar: 0,
    salvo: 0,
  });

  const [studiedCount, setStudiedCount] = useState(0);

  // Hook de Gamificação (Streak / Ofensiva diária via localStorage)
  const { streak, updateStreak } = useGamification();

  // Hook de Flashcards (Fisher-Yates shuffle, avanço e card atual)
  const {
    currentCard,
    nextCard,
    isTrailFinished,
    progress,
    totalCards,
    currentIndex,
  } = useFlashcards(flashcardsData, selectedTrailId);

  // Salva cards favoritos no localStorage
  useEffect(() => {
    localStorage.setItem('redacaoSwipeSavedCards', JSON.stringify(savedCardIds));
  }, [savedCardIds]);

  // Salva meta no localStorage
  useEffect(() => {
    localStorage.setItem('redacaoSwipeDailyGoal', dailyGoal.toString());
  }, [dailyGoal]);

  // Monitora se a rodada/trilha foi finalizada
  useEffect(() => {
    if (isTrailFinished && currentScreen === 'study') {
      updateStreak();
      setCurrentScreen('completed');
    }
  }, [isTrailFinished, currentScreen, updateStreak]);

  // Toggle de salvar card
  const handleToggleSaveCard = (cardId) => {
    setSavedCardIds((prev) => {
      const isAlreadySaved = prev.includes(cardId);
      if (isAlreadySaved) {
        return prev.filter((id) => id !== cardId);
      } else {
        setSessionStats((s) => ({ ...s, salvo: s.salvo + 1 }));
        return [...prev, cardId];
      }
    });
  };

  // Processa Swipe / Classificação do card
  const handleSwipeAction = (action) => {
    if (action === 'dominei') {
      setSessionStats((s) => ({ ...s, domino: s.domino + 1 }));
    } else if (action === 'revisar') {
      setSessionStats((s) => ({ ...s, revisar: s.revisar + 1 }));
    }

    const nextCount = studiedCount + 1;
    setStudiedCount(nextCount);

    // Se bateu a meta diária e terminou a rodada
    if (nextCount >= dailyGoal && currentIndex >= totalCards - 1) {
      updateStreak();
      setCurrentScreen('completed');
    } else {
      nextCard();
    }
  };

  // Inicia sessão de estudo em uma trilha
  const handleStartStudy = (trailId) => {
    if (trailId && typeof trailId === 'string') {
      setSelectedTrailId(trailId);
    }
    setCurrentScreen('study');
  };

  // Navegação entre abas
  const handleNavigateTab = (tab) => {
    setActiveTab(tab);
    setCurrentScreen('main');
  };

  // Salva nova meta diária
  const handleSaveDailyGoal = (newGoal) => {
    setDailyGoal(newGoal);
    setCurrentScreen('main');
  };

  // Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('redacaoSwipeUser');
    setCurrentScreen('login');
  };

  // Se não houver usuário logado e estiver na tela de login
  if (currentScreen === 'login') {
    return (
      <Login
        onBack={() => setCurrentScreen('main')}
        onGoogle={() => {
          const defaultUser = { name: 'Lucas', email: 'lucas@exemplo.com' };
          setUser(defaultUser);
          localStorage.setItem('redacaoSwipeUser', JSON.stringify(defaultUser));
          setCurrentScreen('main');
        }}
        onSubmit={({ name, email }) => {
          const loggedUser = { name: name || 'Lucas', email: email || 'lucas@exemplo.com' };
          setUser(loggedUser);
          localStorage.setItem('redacaoSwipeUser', JSON.stringify(loggedUser));
          setCurrentScreen('main');
        }}
        onForgotPassword={() => alert('Instruções de recuperação enviadas para o seu e-mail.')}
      />
    );
  }

  // Tela de Seleção de Meta Diária (Tela 02)
  if (currentScreen === 'goal_setup') {
    return (
      <DailyGoalModal
        currentGoal={dailyGoal}
        onSaveGoal={handleSaveDailyGoal}
        onBack={() => setCurrentScreen('main')}
      />
    );
  }

  // Tela de Sessão Interativa de Flashcards (Telas 05, 06, 07, 08)
  if (currentScreen === 'study') {
    const isCurrentSaved = currentCard ? savedCardIds.includes(currentCard.id) : false;
    return (
      <StudySession
        trailId={selectedTrailId}
        trailName={currentCard?.trailName || 'Fundamentos'}
        currentCard={currentCard}
        currentIndex={currentIndex}
        totalCards={totalCards || dailyGoal}
        progress={progress}
        isSaved={isCurrentSaved}
        onSwipe={handleSwipeAction}
        onToggleSave={handleToggleSaveCard}
        onClose={() => setCurrentScreen('main')}
        onOpenProfile={() => {
          setActiveTab('perfil');
          setCurrentScreen('main');
        }}
      />
    );
  }

  // Tela de Sessão Finalizada / Meta Concluída (Tela 10)
  if (currentScreen === 'completed') {
    return (
      <SessionCompleted
        streak={streak}
        stats={sessionStats}
        totalStudied={studiedCount}
        onContinueStudying={() => {
          setSelectedTrailId('argumentacao');
          setCurrentScreen('study');
        }}
        onBackToHome={() => {
          setActiveTab('hoje');
          setCurrentScreen('main');
        }}
      />
    );
  }

  // Conteúdo Principal com Tabs
  return (
    <div className="w-full min-h-screen bg-surface">
      {activeTab === 'hoje' && (
        <Home
          userName={user?.name || 'Lucas'}
          streak={streak}
          dailyGoal={dailyGoal}
          studiedCount={studiedCount}
          stats={sessionStats}
          onStartStudy={() => handleStartStudy(selectedTrailId)}
          onNavigate={handleNavigateTab}
          onOpenProfile={() => setActiveTab('perfil')}
        />
      )}

      {activeTab === 'cards' && (
        <CardsLibrary
          savedCardIds={savedCardIds}
          onSelectTrail={(trailId) => handleStartStudy(trailId)}
          onToggleSaveCard={handleToggleSaveCard}
          onStartReviewSaved={() => {
            if (savedCardIds.length > 0) {
              handleStartStudy(selectedTrailId);
            }
          }}
          onOpenProfile={() => setActiveTab('perfil')}
        />
      )}

      {activeTab === 'progresso' && (
        <ProgressPage
          streak={streak}
          stats={{
            domino: Math.max(118, sessionStats.domino),
            revisar: Math.max(36, sessionStats.revisar),
            novos: 18,
          }}
          onOpenProfile={() => setActiveTab('perfil')}
          onStartStudy={() => handleStartStudy(selectedTrailId)}
        />
      )}

      {activeTab === 'perfil' && (
        <ProfilePage
          userName={user?.name || 'Lucas'}
          streak={streak}
          dailyGoal={dailyGoal}
          savedCount={savedCardIds.length}
          onChangeGoal={() => setCurrentScreen('goal_setup')}
          onLogout={handleLogout}
        />
      )}

      {/* Bottom Navigation global para as 4 tabs principais */}
      <BottomNavigation activePath={activeTab} onNavigate={handleNavigateTab} />
    </div>
  );
}
