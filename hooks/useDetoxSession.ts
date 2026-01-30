import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { DetoxSession } from '@/types';
import {
  startSession as storageStartSession,
  endSession as storageEndSession,
  getCurrentSession,
} from '@/lib/storage';

export type SessionState = 'idle' | 'active' | 'returning';

interface UseDetoxSessionReturn {
  sessionState: SessionState;
  currentSession: DetoxSession | null;
  elapsedTime: number;
  startSession: () => Promise<void>;
  endSession: () => Promise<DetoxSession | null>;
  continueSession: () => void;
}

export function useDetoxSession(): UseDetoxSessionReturn {
  const [sessionState, setSessionState] = useState<SessionState>('idle');
  const [currentSession, setCurrentSession] = useState<DetoxSession | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const updateElapsedTime = useCallback(() => {
    if (currentSession) {
      setElapsedTime(Date.now() - currentSession.startTime);
    }
  }, [currentSession]);

  useEffect(() => {
    (async () => {
      const session = await getCurrentSession();
      if (session) {
        setCurrentSession(session);
        setSessionState('returning');
        setElapsedTime(Date.now() - session.startTime);
      }
    })();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active' && currentSession && sessionState === 'active') {
          setSessionState('returning');
          updateElapsedTime();
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [currentSession, sessionState, updateElapsedTime]);

  useEffect(() => {
    if (sessionState === 'active' || sessionState === 'returning') {
      timerRef.current = setInterval(() => {
        updateElapsedTime();
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [sessionState, updateElapsedTime]);

  const startSession = useCallback(async () => {
    const session = await storageStartSession();
    setCurrentSession(session);
    setSessionState('active');
    setElapsedTime(0);
  }, []);

  const endSession = useCallback(async () => {
    const session = await storageEndSession();
    setCurrentSession(null);
    setSessionState('idle');
    setElapsedTime(0);
    return session;
  }, []);

  const continueSession = useCallback(() => {
    setSessionState('active');
  }, []);

  return {
    sessionState,
    currentSession,
    elapsedTime,
    startSession,
    endSession,
    continueSession,
  };
}
