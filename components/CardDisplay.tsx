import React, { useState, useEffect } from 'react';
import { Card } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface CardDisplayProps {
  card: Card;
  isFlipped: boolean;
  onFlip: () => void;
}

export const CardDisplay: React.FC<CardDisplayProps> = ({ card, isFlipped, onFlip }) => {
  return (
    <div className="perspective-1000 w-full max-w-md h-80 cursor-pointer group" onClick={onFlip}>
      <motion.div
        className="relative w-full h-full transform-style-3d"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.2, type: "tween", ease: "easeInOut" }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Face */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="h-full w-full bg-surface border border-border rounded-2xl p-8 flex flex-col items-center justify-center shadow-2xl hover:border-muted transition-colors">
            <span className="text-xs uppercase tracking-widest text-muted mb-4 font-bold">
              {card.type === 'DATE' ? 'Событие' : 'Термин'}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-text leading-tight select-none">
              {card.front}
            </h2>
            <p className="absolute bottom-6 text-sm text-muted animate-pulse">
              Нажми, чтобы перевернуть
            </p>
          </div>
        </div>

        {/* Back Face */}
        <div 
            className="absolute inset-0 w-full h-full backface-hidden"
            style={{ transform: 'rotateY(180deg)' }}
        >
           <div className="h-full w-full bg-surface border border-accent/20 rounded-2xl p-8 flex flex-col items-center justify-center shadow-2xl shadow-white/5">
            <span className="text-xs uppercase tracking-widest text-muted mb-4 font-bold">
              {card.type === 'DATE' ? 'Дата' : 'Значение'}
            </span>
            <h2 className="text-xl md:text-2xl font-medium text-center text-accent leading-relaxed select-none">
              {card.back}
            </h2>
          </div>
        </div>
      </motion.div>
    </div>
  );
};