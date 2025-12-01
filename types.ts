export enum CardType {
  DATE = 'DATE',
  TERM = 'TERM'
}

export interface Card {
  id: string;
  front: string;
  back: string;
  type: CardType;
}

export interface CardStats {
  id: string;
  correct: number;
  incorrect: number;
}

export type StatsMap = Record<string, CardStats>;

export enum GameMode {
  ALL = 'ALL',
  HARD = 'HARD',
  MEDIUM = 'MEDIUM',
  EASY = 'EASY'
}

export enum Category {
  ALL = 'ALL',
  DATES = 'DATES',
  TERMS = 'TERMS'
}

export interface GameSessionState {
  isActive: boolean;
  queue: Card[];
  totalInitial: number;
  currentIndex: number; // Used for progress bar mostly, as queue shifts
}