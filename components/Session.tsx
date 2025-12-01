import React, { useState, useEffect } from 'react';
import { Card, GameSessionState } from '../types';
import { CardDisplay } from './CardDisplay';
import { X, Check, RotateCcw, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface SessionProps {
  session: GameSessionState;
  onResult: (correct: boolean) => void;
  onExit: () => void;
}

export const Session: React.FC<SessionProps> = ({ session, onResult, onExit }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [key, setKey] = useState(0); // Used to force re-render/animation of new card

  const currentCard = session.queue[0];
  const progress = session.totalInitial > 0 
    ? Math.min(100, Math.round(((session.totalInitial - session.queue.length) / session.totalInitial) * 100))
    : 100;

  const remaining = session.queue.length;

  useEffect(() => {
    // Reset flip state when card changes
    setIsFlipped(false);
    setKey(prev => prev + 1);
  }, [currentCard.id]);

  const handleChoice = (correct: boolean) => {
    setIsFlipped(false);
    // Slight delay to allow flip back or just proceed
    setTimeout(() => {
        onResult(correct);
    }, 150);
  };

  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-6">
            <Check className="w-10 h-10 text-black" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Сеанс завершен!</h2>
        <p className="text-muted mb-8">Вы прошли все карточки в этой подборке.</p>
        <button
          onClick={onExit}
          className="px-8 py-3 bg-surface border border-border rounded-xl text-white hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          В главное меню
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between w-full h-full max-h-[800px] py-4">
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-8 px-4">
        <button 
            onClick={onExit}
            className="p-2 -ml-2 text-muted hover:text-white transition-colors"
        >
            <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
            <span className="text-sm font-mono text-muted">
                {session.totalInitial - remaining + 1} / {session.totalInitial}
            </span>
        </div>
        <div className="w-8" /> {/* Spacer for centering */}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md h-1 bg-surface rounded-full overflow-hidden mb-8">
        <div 
            className="h-full bg-accent transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
        />
      </div>

      {/* Card Area */}
      <div className="flex-1 flex items-center justify-center w-full px-4 mb-8">
        <motion.div
            key={currentCard.id} // Forces animation on change
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full flex justify-center"
        >
             <CardDisplay 
                card={currentCard} 
                isFlipped={isFlipped} 
                onFlip={() => setIsFlipped(!isFlipped)} 
            />
        </motion.div>
      </div>

      {/* Controls */}
      <div className="w-full max-w-md px-4 grid grid-cols-2 gap-4">
        <button
          onClick={() => handleChoice(false)}
          className="flex flex-col items-center justify-center p-4 rounded-xl border border-red-900/30 bg-red-950/10 text-red-400 hover:bg-red-900/20 active:scale-95 transition-all"
        >
          <X className="w-6 h-6 mb-1" />
          <span className="font-semibold text-sm uppercase tracking-wide">Не знаю</span>
        </button>

        <button
          onClick={() => handleChoice(true)}
          className="flex flex-col items-center justify-center p-4 rounded-xl border border-green-900/30 bg-green-950/10 text-green-400 hover:bg-green-900/20 active:scale-95 transition-all"
        >
          <Check className="w-6 h-6 mb-1" />
          <span className="font-semibold text-sm uppercase tracking-wide">Знаю</span>
        </button>
      </div>
    </div>
  );
};