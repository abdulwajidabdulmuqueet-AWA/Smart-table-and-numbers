export type Language = 'en' | 'hi' | 'mr' | 'ur';

export type AppView = 
  | 'dashboard'
  | 'tables-learning'
  | 'tables-games'
  | 'number-learning'
  | 'number-games'
  | 'practice'
  | 'progress'
  | 'settings';

export type ViewType = AppView;

export type TableGameType = 
  | 'find-answer'
  | 'complete-table'
  | 'falling-numbers'
  | 'match-pair'
  | 'table-race'
  | 'missing-number'
  | 'true-false'
  | 'memory-game';

export type NumberGameType = 
  | 'identify-number'
  | 'place-value'
  | 'number-builder'
  | 'comparison'
  | 'sequence'
  | 'number-memory'
  | 'number-challenge';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type RhythmSpeed = 'slow' | 'normal' | 'fast' | 'very-fast' | 'custom';

export interface UserProgress {
  tablesMastery: Record<number, number>; // Table number -> stars 0 to 5
  totalAnswered: number;
  correctAnswered: number;
  bestStreak: number;
  currentStreak: number;
  gamesPlayed: number;
  unlockedBadges: string[];
  lastActive: string;
  history: GameHistoryItem[];
}

export interface GameHistoryItem {
  id: string;
  timestamp: string;
  gameType: string;
  score: number;
  total: number;
  accuracy: number;
}

export interface Badge {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  color: string;
  isUnlocked: (progress: UserProgress) => boolean;
}

export interface AppSettings {
  language: Language;
  soundEnabled: boolean;
  speechEnabled: boolean;
  voiceModeEnabled: boolean;
  classroomMode: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  rhythmSpeed: RhythmSpeed;
  customRhythmDelaySec: number;
  defaultTableRange: [number, number];
  speechRate: number;
}

export interface IndianPlaceValue {
  placeName: {
    en: string;
    hi: string;
    mr: string;
    ur: string;
  };
  shortName: {
    en: string;
    hi: string;
    mr: string;
    ur: string;
  };
  multiplier: number;
  digitIndex: number;
}
