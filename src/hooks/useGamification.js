import { useState, useEffect } from 'react';

const useGamification = () => {
  const [streak, setStreak] = useState(0);
  const [lastStudyDate, setLastStudyDate] = useState(null);

  // Load streak data from localStorage on mount
  useEffect(() => {
    const savedStreak = localStorage.getItem('redacaoSwipeStreak');
    const savedLastDate = localStorage.getItem('redacaoSwipeLastStudyDate');

    if (savedStreak) {
      setStreak(parseInt(savedStreak, 10));
    }
    if (savedLastDate) {
      setLastStudyDate(new Date(savedLastDate));
    }
  }, []);

  // Update streak when user studies
  const updateStreak = () => {
    const today = new Date();
    const todayDate = today.toDateString();
    const lastDate = lastStudyDate ? lastStudyDate.toDateString() : null;

    if (lastDate === todayDate) {
      // Already studied today, streak remains the same
      return;
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toDateString();

    let newStreak;

    if (lastDate === yesterdayDate) {
      // Consecutive day, increment streak
      newStreak = streak + 1;
    } else if (lastDate !== todayDate) {
      // Streak broken or first time, start from 1
      newStreak = 1;
    } else {
      // Already studied today
      newStreak = streak;
    }

    setStreak(newStreak);
    setLastStudyDate(today);

    // Save to localStorage
    localStorage.setItem('redacaoSwipeStreak', newStreak.toString());
    localStorage.setItem('redacaoSwipeLastStudyDate', today.toISOString());
  };

  // Calculate progress percentage (0% to 100%)
  const calculateProgress = (current, total) => {
    if (total === 0) return 0;
    return Math.round(((current + 1) / total) * 100);
  };

  return {
    streak,
    updateStreak,
    calculateProgress,
    lastStudyDate
  };
};

export default useGamification;
