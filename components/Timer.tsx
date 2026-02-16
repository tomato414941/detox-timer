import { StyleSheet, Pressable } from 'react-native';
import { Text, View } from './Themed';
import { useDetoxSession } from '@/hooks/useDetoxSession';
import { DetoxSession } from '@/types';
import { formatResultText, getLocale, t } from '@/lib/i18n';

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

interface TimerProps {
  onSessionEnd?: (session: DetoxSession) => void;
}

export function Timer({ onSessionEnd }: TimerProps) {
  const locale = getLocale();
  const {
    sessionState,
    elapsedTime,
    startSession,
    endSession,
    continueSession,
  } = useDetoxSession();

  const handleEndSession = async () => {
    const session = await endSession();
    if (session && onSessionEnd) {
      onSessionEnd(session);
    }
  };

  if (sessionState === 'idle') {
    return (
      <View style={styles.container}>
        <Text style={styles.instruction}>{t('timerInstruction', locale)}</Text>
        <Pressable style={styles.startButton} onPress={startSession}>
          <Text style={styles.startButtonText}>{t('timerStart', locale)}</Text>
        </Pressable>
      </View>
    );
  }

  if (sessionState === 'active') {
    return (
      <View style={styles.container}>
        <Text style={styles.activeLabel}>{t('timerActive', locale)}</Text>
        <Text style={styles.timer}>{formatDuration(elapsedTime)}</Text>
        <Text style={styles.hint}>{t('timerHint', locale)}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.congratsLabel}>{t('timerWelcomeBack', locale)}</Text>
      <Text style={styles.resultText}>{formatResultText(elapsedTime, locale)}</Text>
      <Text style={styles.timer}>{formatDuration(elapsedTime)}</Text>
      <View style={styles.buttonRow}>
        <Pressable style={styles.continueButton} onPress={continueSession}>
          <Text style={styles.continueButtonText}>{t('timerContinue', locale)}</Text>
        </Pressable>
        <Pressable style={styles.endButton} onPress={handleEndSession}>
          <Text style={styles.endButtonText}>{t('timerEnd', locale)}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  instruction: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.8,
  },
  startButton: {
    backgroundColor: '#4A90A4',
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 40,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  activeLabel: {
    fontSize: 20,
    opacity: 0.7,
    marginBottom: 20,
  },
  timer: {
    fontSize: 64,
    fontWeight: '200',
    fontVariant: ['tabular-nums'],
  },
  hint: {
    fontSize: 14,
    opacity: 0.5,
    marginTop: 40,
    textAlign: 'center',
  },
  congratsLabel: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 18,
    opacity: 0.8,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 40,
    gap: 16,
  },
  continueButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4A90A4',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  continueButtonText: {
    color: '#4A90A4',
    fontSize: 16,
    fontWeight: '600',
  },
  endButton: {
    backgroundColor: '#4A90A4',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  endButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
