import { useState, useEffect } from 'react';

const useFlashcards = (cards, trailId) => {
  const [shuffledCards, setShuffledCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTrailFinished, setIsTrailFinished] = useState(false);

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Filter cards by trail and shuffle when cards or trailId changes
  useEffect(() => {
    if (cards && cards.length > 0) {
      const filteredCards = cards.filter(card => card.trailId === trailId);
      const shuffled = shuffleArray(filteredCards);
      setShuffledCards(shuffled);
      setCurrentIndex(0);
      setIsTrailFinished(false);
    }
  }, [cards, trailId]);

  const nextCard = () => {
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsTrailFinished(true);
    }
  };

  const currentCard = shuffledCards[currentIndex] || null;
  const progress = shuffledCards.length > 0 ? ((currentIndex + 1) / shuffledCards.length) * 100 : 0;

  return {
    currentCard,
    nextCard,
    isTrailFinished,
    progress,
    totalCards: shuffledCards.length,
    currentIndex
  };
};

export default useFlashcards;
