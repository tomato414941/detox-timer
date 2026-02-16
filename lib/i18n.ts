import { getLocales } from 'expo-localization';

export type AppLocale = 'ja' | 'en';

const translations = {
  ja: {
    tabTimer: 'タイマー',
    tabStats: '統計',
    timerInstruction: 'スマホを置いてデトックスを始めましょう',
    timerStart: '開始',
    timerActive: 'デトックス中...',
    timerHint: '画面をロックしてスマホを置いてください',
    timerWelcomeBack: 'おかえりなさい!',
    timerContinue: 'もう少し続ける',
    timerEnd: '終了する',
    statsLoading: '読み込み中...',
    statsToday: '今日のデトックス',
    statsWeekly: '今週の累計',
    statsStreak: '連続達成日数',
    statsKeepGoing: 'この調子で続けましょう!',
  },
  en: {
    tabTimer: 'Timer',
    tabStats: 'Stats',
    timerInstruction: 'Put your phone down and start your detox session',
    timerStart: 'Start',
    timerActive: 'Detox in progress...',
    timerHint: 'Lock your screen and leave your phone',
    timerWelcomeBack: 'Welcome back!',
    timerContinue: 'Keep going',
    timerEnd: 'End session',
    statsLoading: 'Loading...',
    statsToday: "Today's Detox",
    statsWeekly: 'Weekly Total',
    statsStreak: 'Current Streak',
    statsKeepGoing: 'Keep it up!',
  },
} as const;

type TranslationKey = keyof (typeof translations)['en'];

function resolveLocale(languageTag?: string | null, languageCode?: string | null): AppLocale {
  const normalizedTag = languageTag?.toLowerCase();
  const normalizedCode = languageCode?.toLowerCase();

  if (normalizedTag?.startsWith('ja') || normalizedCode === 'ja') {
    return 'ja';
  }
  return 'en';
}

export function getLocale(): AppLocale {
  const locale = getLocales()[0];
  return resolveLocale(locale?.languageTag, locale?.languageCode);
}

export function t(key: TranslationKey, locale = getLocale()): string {
  return translations[locale][key];
}

export function formatSessionLength(ms: number, locale = getLocale()): string {
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) {
    const seconds = Math.floor(ms / 1000);
    return locale === 'ja' ? `${seconds}秒間` : `${seconds} sec`;
  }
  return locale === 'ja' ? `${minutes}分間` : `${minutes} min`;
}

export function formatStatsDuration(ms: number, locale = getLocale()): string {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (locale === 'ja') {
    return hours > 0 ? `${hours}時間${minutes}分` : `${minutes}分`;
  }

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${minutes}m`;
}

export function formatSessionCount(count: number, locale = getLocale()): string {
  if (locale === 'ja') {
    return `${count}回のセッション`;
  }
  return `${count} ${count === 1 ? 'session' : 'sessions'}`;
}

export function formatStreakDays(days: number, locale = getLocale()): string {
  if (locale === 'ja') {
    return `${days}日`;
  }
  return `${days} ${days === 1 ? 'day' : 'days'}`;
}

export function formatResultText(ms: number, locale = getLocale()): string {
  const duration = formatSessionLength(ms, locale);
  if (locale === 'ja') {
    return `${duration}デトックスしました`;
  }
  return `Detoxed for ${duration}`;
}
