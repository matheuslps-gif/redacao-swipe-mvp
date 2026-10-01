import { useState, useEffect, useCallback } from 'react';
import { userDataService } from '../services/userDataService';

const useGamification = (userId = null) => {
  const [streak, setStreak] = useState(0);
  const [lastStudyDate, setLastStudyDate] = useState(null);

  // Carrega dados de streak do Supabase / cache por usuário
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      let currentStreak = 0;
      let lastDate = null;

      if (userId) {
        const progress = await userDataService.getUserProgress(userId);
        if (progress) {
          currentStreak = progress.streak || 0;
          lastDate = progress.lastStudyDate;
        }
      } else {
        const fallbackStreak = localStorage.getItem('redacaoSwipeStreak');
        const fallbackDate = localStorage.getItem('redacaoSwipeLastStudyDate');
        if (fallbackStreak) currentStreak = parseInt(fallbackStreak, 10);
        if (fallbackDate) lastDate = new Date(fallbackDate);
      }

      // Validação de quebra de sequência se mais de 1 dia se passou desde o último estudo
      if (lastDate) {
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const startOfLast = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
        const diffDays = Math.round((startOfToday - startOfLast) / (1000 * 60 * 60 * 24));

        if (diffDays > 1) {
          // Quebrou a sequência (passou mais de 1 dia sem atividade)
          currentStreak = 0;
        }
      }

      if (isMounted) {
        setStreak(currentStreak);
        setLastStudyDate(lastDate);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  // Atualiza a ofensiva/streak diária ao realizar atividade
  const updateStreak = useCallback(() => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    let lastDate = lastStudyDate;
    if (!lastDate && userId) {
      const cached = localStorage.getItem(`redacaoSwipeLastStudyDate_${userId}`);
      if (cached) lastDate = new Date(cached);
    }

    let newStreak = streak;

    if (lastDate) {
      const startOfLast = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
      const diffDays = Math.round((startOfToday - startOfLast) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Já estudou hoje, mantém a ofensiva ativa (mínimo 1 se tiver streak)
        newStreak = Math.max(1, streak);
      } else if (diffDays === 1) {
        // Dia consecutivo (ontem -> hoje): incrementa a ofensiva
        newStreak = (streak || 0) + 1;
      } else {
        // Mais de 1 dia sem atividade: reinicia a ofensiva em 1
        newStreak = 1;
      }
    } else {
      // Primeiro estudo registrado
      newStreak = 1;
    }

    setStreak(newStreak);
    setLastStudyDate(today);

    // Salva isolado no Supabase / LocalStorage
    userDataService.saveStreak(userId, newStreak, today);

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
