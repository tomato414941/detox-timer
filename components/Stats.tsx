import { StyleSheet } from 'react-native';
import { Text, View } from './Themed';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { getTodayStats, getWeeklyTotal, getStreak } from '@/lib/storage';
import { DailyStats } from '@/types';

function formatDuration(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}時間${minutes}分`;
  }
  return `${minutes}分`;
}

export function Stats() {
  const [todayStats, setTodayStats] = useState<DailyStats | null>(null);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    setLoading(true);
    const [today, weekly, currentStreak] = await Promise.all([
      getTodayStats(),
      getWeeklyTotal(),
      getStreak(),
    ]);
    setTodayStats(today);
    setWeeklyTotal(weekly);
    setStreak(currentStreak);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>今日のデトックス</Text>
        <Text style={styles.statValue}>
          {todayStats ? formatDuration(todayStats.totalDuration) : '0分'}
        </Text>
        <Text style={styles.statSubtext}>
          {todayStats?.sessionCount || 0}回のセッション
        </Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statLabel}>今週の累計</Text>
        <Text style={styles.statValue}>{formatDuration(weeklyTotal)}</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statLabel}>連続達成日数</Text>
        <Text style={styles.statValue}>{streak}日</Text>
        {streak > 0 && (
          <Text style={styles.statSubtext}>この調子で続けましょう!</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
    marginTop: 40,
  },
  statCard: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(74, 144, 164, 0.1)',
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 36,
    fontWeight: '600',
  },
  statSubtext: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 8,
  },
});
