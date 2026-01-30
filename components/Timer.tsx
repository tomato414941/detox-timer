import { StyleSheet, Pressable } from 'react-native';
import { Text, View } from './Themed';
import { useDetoxSession, SessionState } from '@/hooks/useDetoxSession';
import { DetoxSession } from '@/types';

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

function formatMinutes(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) {
    const seconds = Math.floor(ms / 1000);
    return `${seconds}秒間`;
  }
  return `${minutes}分間`;
}

interface TimerProps {
  onSessionEnd?: (session: DetoxSession) => void;
}

export function Timer({ onSessionEnd }: TimerProps) {
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
        <Text style={styles.instruction}>
          スマホを置いてデトックスを始めましょう
        </Text>
        <Pressable style={styles.startButton} onPress={startSession}>
          <Text style={styles.startButtonText}>開始</Text>
        </Pressable>
      </View>
    );
  }

  if (sessionState === 'active') {
    return (
      <View style={styles.container}>
        <Text style={styles.activeLabel}>デトックス中...</Text>
        <Text style={styles.timer}>{formatDuration(elapsedTime)}</Text>
        <Text style={styles.hint}>
          画面をロックしてスマホを置いてください
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.congratsLabel}>おかえりなさい!</Text>
      <Text style={styles.resultText}>
        {formatMinutes(elapsedTime)}デトックスしました
      </Text>
      <Text style={styles.timer}>{formatDuration(elapsedTime)}</Text>
      <View style={styles.buttonRow}>
        <Pressable style={styles.continueButton} onPress={continueSession}>
          <Text style={styles.continueButtonText}>もう少し続ける</Text>
        </Pressable>
        <Pressable style={styles.endButton} onPress={handleEndSession}>
          <Text style={styles.endButtonText}>終了する</Text>
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
