export interface DetoxSession {
  id: string;
  startTime: number;
  endTime: number | null;
  duration: number;
}

export interface DailyStats {
  date: string;
  totalDuration: number;
  sessionCount: number;
}

export interface StorageData {
  sessions: DetoxSession[];
  currentSession: DetoxSession | null;
}
