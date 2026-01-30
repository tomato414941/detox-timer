import AsyncStorage from '@react-native-async-storage/async-storage';
import { DetoxSession, DailyStats, StorageData } from '@/types';

const STORAGE_KEY = 'detox_timer_data';

export async function loadData(): Promise<StorageData> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { sessions: [], currentSession: null };
  }
  return JSON.parse(raw);
}

export async function saveData(data: StorageData): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function startSession(): Promise<DetoxSession> {
  const data = await loadData();
  const session: DetoxSession = {
    id: Date.now().toString(),
    startTime: Date.now(),
    endTime: null,
    duration: 0,
  };
  data.currentSession = session;
  await saveData(data);
  return session;
}

export async function endSession(): Promise<DetoxSession | null> {
  const data = await loadData();
  if (!data.currentSession) return null;

  const endTime = Date.now();
  const session: DetoxSession = {
    ...data.currentSession,
    endTime,
    duration: endTime - data.currentSession.startTime,
  };

  data.sessions.push(session);
  data.currentSession = null;
  await saveData(data);
  return session;
}

export async function getCurrentSession(): Promise<DetoxSession | null> {
  const data = await loadData();
  return data.currentSession;
}

export async function getAllSessions(): Promise<DetoxSession[]> {
  const data = await loadData();
  return data.sessions;
}

function getDateString(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getStartOfDay(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function getStartOfWeek(date: Date): number {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export async function getTodayStats(): Promise<DailyStats> {
  const sessions = await getAllSessions();
  const today = getDateString(Date.now());

  const todaySessions = sessions.filter(
    (s) => getDateString(s.startTime) === today
  );

  return {
    date: today,
    totalDuration: todaySessions.reduce((sum, s) => sum + s.duration, 0),
    sessionCount: todaySessions.length,
  };
}

export async function getWeeklyTotal(): Promise<number> {
  const sessions = await getAllSessions();
  const weekStart = getStartOfWeek(new Date());

  const weekSessions = sessions.filter((s) => s.startTime >= weekStart);
  return weekSessions.reduce((sum, s) => sum + s.duration, 0);
}

export async function getStreak(): Promise<number> {
  const sessions = await getAllSessions();
  if (sessions.length === 0) return 0;

  const uniqueDates = new Set<string>();
  sessions.forEach((s) => uniqueDates.add(getDateString(s.startTime)));

  const sortedDates = Array.from(uniqueDates).sort().reverse();
  if (sortedDates.length === 0) return 0;

  const today = getDateString(Date.now());
  const yesterday = getDateString(Date.now() - 24 * 60 * 60 * 1000);

  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);
    const diffDays = Math.floor(
      (prevDate.getTime() - currDate.getTime()) / (24 * 60 * 60 * 1000)
    );

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
