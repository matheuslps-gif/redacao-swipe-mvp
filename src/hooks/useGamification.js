import { useState, useEffect, useCallback } from 'react';
import { userDataService } from '../services/userDataService';

const useGamification = (userId = null) => {
  const [streak, setStreak] = useState(0);
  const [lastStudyDate, setLastStudyDate] = useState(null);

  // Carrega dados de streak do Supabase / cache por usuário
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!userId) {
        const fallbackStreak = localStorage.getItem('redacaoSwipeStreak');
        const fallbackDate = localStorage.getItem('redacaoSwipeLastStudyDate');
        if (isMounted) {
          if (fallbackStreak) setStreak(parseInt(fallbackStreak, 10));
          if (fallbackDate) setLastStudyDate(new Date(fallbackDate));
        }
        return;
      }

      const progress = await userDataService.getUserProgress(userId);
      if (isMounted && progress) {
        setStreak(progress.streak);
        setLastStudyDate(progress.lastStudyDate);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  // Atualiza a ofensiva/streak diária
  const updateStreak = useCallback(() => {
    const today = new Date();
    const todayDate = today.toDateString();
    const lastDate = lastStudyDate ? lastStudyDate.toDateString() : null;

    if (lastDate === todayDate) {
      // Já estudou hoje, mantém a ofensiva
      return streak;
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toDateString();

    let newStreak;

    if (lastDate === yesterdayDate) {
      // Dia consecutivo: incrementa
      newStreak = streak + 1;
    } else {
      // Primeira vez ou quebra de ofensiva: reinicia em 1
      newStreak = 1;
    }

    setStreak(newStreak);
    setLastStudyDate(today);

    // Salva isolado no Supabase / LocalStorage
    userDataService.saveStreak(userId, newStreak, today);

    // Salva também no fallback global para compatibilidade
    localStorage.setItem('redacaoSwipeStreak', newStreak.toString());
    localStorage.setItem('redacaoSwipeLastStudyDate', today.toISOString());

    return newStreak;
  }, [lastStudyDate, streak, userId]);

  // Calcula percentual de progresso (0% a 100%)
  const calculateProgress = (current, total) => {
    if (total === 0) return 0;
    return Math.round(((current + 1) / total) * 100);
  };

  return {
    streak,
    updateStreak,
    calculateProgress,
    lastStudyDate,
  };
};

export default useGamification;
