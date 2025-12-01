import React, { useState, useEffect, useMemo } from 'react';
import { CARDS } from './constants';
import { Card, StatsMap, GameMode, Category, GameSessionState, CardType } from './types';
import { MainMenu } from './components/MainMenu';
import { Session } from './components/Session';

const STATS_KEY = 'history_flashcards_stats_v1';

export default function App() {
  const [stats, setStats] = useState<StatsMap>({});
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.ALL);
  const [session, setSession] = useState<GameSessionState>({
    isActive: false,
    queue: [],
    totalInitial: 0,
    currentIndex: 0,
  });

  // Load stats on mount
  useEffect(() => {
    const saved = localStorage.getItem(STATS_KEY);
    if (saved) {
      try {
        setStats(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse stats", e);
      }
    }
  }, []);

  // Save stats on change
  useEffect(() => {
    if (Object.keys(stats).length > 0) {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    }
  }, [stats]);

  const updateStats = (cardId: string, correct: boolean) => {
    setStats((prev) => {
      const current = prev[cardId] || { id: cardId, correct: 0, incorrect: 0 };
      return {
        ...prev,
        [cardId]: {
          ...current,
          correct: current.correct + (correct ? 1 : 0),
          incorrect: current.incorrect + (correct ? 0 : 1),
        },
      };
    });
  };

  const getDifficultyScore = (cardId: string) => {
    const s = stats[cardId];
    if (!s) return 0; // Neutral
    const total = s.correct + s.incorrect;
    if (total === 0) return 0;
    // Higher ratio of incorrect = higher score (harder)
    return s.incorrect / total;
  };

  const startSession = (mode: GameMode, category: Category) => {
    let filtered = CARDS;

    // Filter by Category
    if (category === Category.DATES) {
      filtered = filtered.filter(c => c.type === CardType.DATE);
    } else if (category === Category.TERMS) {
      filtered = filtered.filter(c => c.type === CardType.TERM);
    }

    // Filter/Sort by Mode
    let finalQueue: Card[] = [];
    
    // Sort all cards by difficulty score first
    const cardsWithScore = filtered.map(c => ({
      card: c,
      score: getDifficultyScore(c.id),
      totalAttempts: (stats[c.id]?.correct || 0) + (stats[c.id]?.incorrect || 0)
    }));

    if (mode === GameMode.ALL) {
      // Shuffle random
      finalQueue = cardsWithScore.map(c => c.card).sort(() => Math.random() - 0.5);
    } else if (mode === GameMode.HARD) {
      // Filter for cards with at least 1 attempt and high incorrect ratio (> 40%)
      // If no cards meet criteria, fallback to top 20 hardest
      const hardCards = cardsWithScore.filter(c => c.totalAttempts > 0 && c.score >= 0.4);
      if (hardCards.length < 5) {
         // Fallback: take top 20 sorted by score descending
         finalQueue = cardsWithScore.sort((a, b) => b.score - a.score).slice(0, 20).map(c => c.card);
      } else {
         finalQueue = hardCards.map(c => c.card);
      }
    } else if (mode === GameMode.MEDIUM) {
        // Score between 0.2 and 0.5
        const mediumCards = cardsWithScore.filter(c => c.totalAttempts > 0 && c.score >= 0.2 && c.score < 0.5);
        if (mediumCards.length < 5) {
             // Fallback: middle range logic is fuzzy, let's just take random slice
             finalQueue = cardsWithScore.sort(() => Math.random() - 0.5).slice(0, 20).map(c => c.card);
        } else {
            finalQueue = mediumCards.map(c => c.card);
        }
    } else if (mode === GameMode.EASY) {
        // Score < 0.2 or 0 attempts
        const easyCards = cardsWithScore.filter(c => c.score < 0.2);
        finalQueue = easyCards.map(c => c.card).sort(() => Math.random() - 0.5);
    }

    // Shuffle result slightly to prevent identical order every time in filtered modes
    if (mode !== GameMode.ALL) {
        finalQueue.sort(() => Math.random() - 0.5);
    }

    setSession({
      isActive: true,
      queue: finalQueue,
      totalInitial: finalQueue.length,
      currentIndex: 0
    });
  };

  const handleResult = (correct: boolean) => {
    const currentCard = session.queue[0];
    if (!currentCard) return;

    updateStats(currentCard.id, correct);

    let newQueue = [...session.queue];
    newQueue.shift(); // Remove current

    if (correct) {
      // If correct, it's removed from session
      setSession(prev => ({
        ...prev,
        queue: newQueue,
        currentIndex: prev.currentIndex + 1
      }));
    } else {
      // If incorrect, add back to end of queue to see again this session
      newQueue.push(currentCard);
      setSession(prev => ({
        ...prev,
        queue: newQueue,
        // currentIndex doesn't increment because we still have to clear this specific item essentially
      }));
    }
  };

  const exitSession = () => {
    setSession({
      isActive: false,
      queue: [],
      totalInitial: 0,
      currentIndex: 0
    });
  };

  return (
    <div className="min-h-screen w-full bg-background text-text flex items-center justify-center font-sans selection:bg-accent selection:text-black overflow-hidden relative">
      {/* Background ambient noise/gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 via-background to-background pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-4xl h-full flex flex-col items-center justify-center p-4">
        {!session.isActive ? (
          <MainMenu 
            onStart={startSession} 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        ) : (
          <Session 
            session={session}
            onResult={handleResult}
            onExit={exitSession}
          />
        )}
      </div>
    </div>
  );
}