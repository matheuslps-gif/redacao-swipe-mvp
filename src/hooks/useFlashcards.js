import { useState, useEffect, useRef } from 'react';

const useFlashcards = (cards, trailId, userReviews = []) => {
  const [shuffledCards, setShuffledCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTrailFinished, setIsTrailFinished] = useState(false);
  const initializedTrailRef = useRef(null);

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Prepara os cards da trilha isolada evitando cards já dominados
  useEffect(() => {
    if (cards && cards.length > 0) {
      const allTrailCards = cards.filter((card) => card.trailId === trailId);

      // Mapeia último status de cada card do usuário
      const latestReviews = {};
      for (const r of userReviews) {
        if (r.card_id) latestReviews[r.card_id] = r.action;
      }

      // Separa os cards não dominados (novos + a revisar)
      const pendingCards = allTrailCards.filter(
        (card) => latestReviews[card.id] !== 'dominei'
      );

      // Se todos os cards da trilha já foram dominados, usa todos para revisão de retenção
      const targetCards = pendingCards.length > 0 ? pendingCards : allTrailCards;

      const shuffled = shuffleArray(targetCards);
      setShuffledCards(shuffled);
      setCurrentIndex(0);
      setIsTrailFinished(false);
      initializedTrailRef.current = trailId;
    }
  }, [cards, trailId]);

  const nextCard = () => {
    setCurrentIndex((prev) => {
      if (prev < shuffledCards.length - 1) {
        return prev + 1;
      }
      setIsTrailFinished(true);
      return prev;
    });
  };

  const currentCard = shuffledCards[currentIndex] || null;
  const nextCardItem = shuffledCards[currentIndex + 1] || null;
  const progress =
    shuffledCards.length > 0 ? Math.round(((currentIndex + 1) / shuffledCards.length) * 100) : 0;

  return {
    currentCard,
    nextCardItem,
    nextCard,
    isTrailFinished,
    progress,
    totalCards: shuffledCards.length,
    currentIndex,
  };
};

export default useFlashcards;
