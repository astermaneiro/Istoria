import React from 'react';
import { GameMode, Category } from '../types';
import { BookOpen, Brain, Gauge, Layers } from 'lucide-react';

interface MainMenuProps {
  onStart: (mode: GameMode, category: Category) => void;
  selectedCategory: Category;
  setSelectedCategory: (c: Category) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStart, selectedCategory, setSelectedCategory }) => {
  
  const categories = [
    { id: Category.TERMS, label: 'Термины' },
    { id: Category.DATES, label: 'Даты' },
    { id: Category.ALL, label: 'Всё' },
  ];

  const modes = [
    { 
      id: GameMode.ALL, 
      label: 'Все карточки', 
      desc: 'Проходите все карточки по порядку',
      icon: <Layers className="w-6 h-6 mb-2" />
    },
    { 
      id: GameMode.HARD, 
      label: 'Сложные', 
      desc: 'Только то, что часто забываете',
      icon: <Brain className="w-6 h-6 mb-2 text-red-400" />
    },
    { 
      id: GameMode.MEDIUM, 
      label: 'Средние', 
      desc: 'Закрепление материала',
      icon: <Gauge className="w-6 h-6 mb-2 text-yellow-400" />
    },
    { 
      id: GameMode.EASY, 
      label: 'Лёгкие', 
      desc: 'Быстрое повторение',
      icon: <BookOpen className="w-6 h-6 mb-2 text-green-400" />
    },
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-2xl px-4 animate-in fade-in zoom-in duration-500">
      <h1 className="text-4xl md:text-6xl font-black text-accent tracking-tighter mb-2 text-center">
        ISTORIA
      </h1>
      <p className="text-muted mb-12 text-center max-w-md">
        Тренировка памяти для исторических дат и терминов.
      </p>

      {/* Category Selector */}
      <div className="flex p-1 bg-surface border border-border rounded-xl mb-12 w-full max-w-md">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              selectedCategory === cat.id
                ? 'bg-accent text-black shadow-lg'
                : 'text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Mode Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onStart(mode.id, selectedCategory)}
            className="group relative flex flex-col items-center justify-center p-6 rounded-2xl border border-border bg-surface hover:border-muted hover:bg-white/5 transition-all duration-300 active:scale-95 text-center"
          >
            <div className="opacity-80 group-hover:opacity-100 transition-opacity">
              {mode.icon}
            </div>
            <h3 className="text-lg font-bold text-text group-hover:text-accent mb-1">
              {mode.label}
            </h3>
            <p className="text-xs text-muted">
              {mode.desc}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};