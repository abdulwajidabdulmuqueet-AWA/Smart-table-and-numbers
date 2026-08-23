import { AppSettings, UserProgress, Badge } from '../types';

const SETTINGS_KEY = 'maths_pwa_settings_v1';
const PROGRESS_KEY = 'maths_pwa_progress_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  soundEnabled: true,
  speechEnabled: true,
  voiceModeEnabled: false,
  classroomMode: false,
  highContrast: false,
  reducedMotion: false,
  rhythmSpeed: 'normal',
  customRhythmDelaySec: 2.0,
  defaultTableRange: [2, 20],
  speechRate: 0.9
};

export const DEFAULT_PROGRESS: UserProgress = {
  tablesMastery: {
    2: 5, 3: 4, 4: 3, 5: 5, 6: 2, 7: 1, 8: 1, 9: 0, 10: 5,
    11: 2, 12: 1, 13: 0, 14: 0, 15: 1, 16: 0, 17: 0, 18: 0, 19: 0, 20: 3
  },
  totalAnswered: 48,
  correctAnswered: 44,
  bestStreak: 12,
  currentStreak: 4,
  gamesPlayed: 14,
  unlockedBadges: ['fast-calc', 'ten-streak'],
  lastActive: new Date().toISOString(),
  history: []
};

export const BADGES: Badge[] = [
  {
    id: 'table-master',
    titleKey: '🏆 Table Master',
    descriptionKey: 'Master at least 5 tables with 5 stars',
    icon: '🏆',
    color: 'from-amber-400 to-yellow-500',
    isUnlocked: (p) => Object.values(p.tablesMastery).filter(s => s >= 5).length >= 5
  },
  {
    id: 'fast-calc',
    titleKey: '⚡ Fast Calculator',
    descriptionKey: 'Complete a table speed sprint with high accuracy',
    icon: '⚡',
    color: 'from-blue-400 to-indigo-600',
    isUnlocked: (p) => p.totalAnswered >= 10 && (p.correctAnswered / (p.totalAnswered || 1)) >= 0.8
  },
  {
    id: 'accuracy-champion',
    titleKey: '🎯 Accuracy Champion',
    descriptionKey: 'Answer at least 25 questions with over 90% accuracy',
    icon: '🎯',
    color: 'from-emerald-400 to-teal-600',
    isUnlocked: (p) => p.totalAnswered >= 25 && (p.correctAnswered / (p.totalAnswered || 1)) >= 0.9
  },
  {
    id: 'ten-streak',
    titleKey: '🔥 10 Streak Master',
    descriptionKey: 'Achieve an unbroken streak of 10 correct answers in a row',
    icon: '🔥',
    color: 'from-orange-400 to-red-500',
    isUnlocked: (p) => p.bestStreak >= 10
  },
  {
    id: 'number-master',
    titleKey: '👑 Number Master',
    descriptionKey: 'Explore Indian place values from Ones to Crores and play number games',
    icon: '👑',
    color: 'from-purple-400 to-pink-600',
    isUnlocked: (p) => p.gamesPlayed >= 5
  },
  {
    id: 'multiplication-champ',
    titleKey: '🥇 Multiplication Champion',
    descriptionKey: 'Practice all tables from 2 to 20',
    icon: '🥇',
    color: 'from-rose-400 to-amber-500',
    isUnlocked: (p) => Object.values(p.tablesMastery).filter(s => s >= 3).length >= 10
  }
];

export function loadSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to load settings:', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings:', e);
  }
}

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) {
      return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to load progress:', e);
  }
  return DEFAULT_PROGRESS;
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Failed to save progress:', e);
  }
}

export function updateGameResults(
  isCorrect: boolean,
  tableNum?: number
): UserProgress {
  const current = loadProgress();
  const newTotal = current.totalAnswered + 1;
  const newCorrect = current.correctAnswered + (isCorrect ? 1 : 0);
  const newCurrentStreak = isCorrect ? current.currentStreak + 1 : 0;
  const newBestStreak = Math.max(current.bestStreak, newCurrentStreak);

  const newMastery = { ...current.tablesMastery };
  if (tableNum && tableNum >= 2 && tableNum <= 20) {
    const currentStars = newMastery[tableNum] || 0;
    if (isCorrect && currentStars < 5) {
      // increase mastery gradually
      newMastery[tableNum] = Math.min(5, currentStars + 1);
    }
  }

  // Check unlocked badges
  const updatedProgress: UserProgress = {
    ...current,
    totalAnswered: newTotal,
    correctAnswered: newCorrect,
    currentStreak: newCurrentStreak,
    bestStreak: newBestStreak,
    tablesMastery: newMastery,
    lastActive: new Date().toISOString()
  };

  const unlocked = [...current.unlockedBadges];
  BADGES.forEach(badge => {
    if (!unlocked.includes(badge.id) && badge.isUnlocked(updatedProgress)) {
      unlocked.push(badge.id);
    }
  });

  updatedProgress.unlockedBadges = unlocked;
  saveProgress(updatedProgress);
  return updatedProgress;
}

export function exportProgressJson(progress: UserProgress): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(progress, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `maths_progress_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importProgressJson(jsonString: string): UserProgress | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && typeof parsed.totalAnswered === 'number') {
      const merged: UserProgress = {
        ...DEFAULT_PROGRESS,
        ...parsed,
        lastActive: new Date().toISOString()
      };
      saveProgress(merged);
      return merged;
    }
  } catch (e) {
    console.error('Invalid JSON progress file:', e);
  }
  return null;
}
