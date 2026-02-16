import { StyleSheet } from 'react-native';
import { Text, View } from './Themed';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { getTodayStats, getWeeklyTotal, getStreak } from '@/lib/storage';
import { DailyStats } from '@/types';
import {
  formatSessionCount,
  formatStatsDuration,
  formatStreakDays,
  getLocale,
  t,
} from '@/lib/i18n';

export function Stats() {
  const locale = getLocale();
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
        <Text style={styles.loadingText}>{t('statsLoading', locale)}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>{t('statsToday', locale)}</Text>
        <Text style={styles.statValue}>
          {todayStats ? formatStatsDuration(todayStats.totalDuration, locale) : formatStatsDuration(0, locale)}
        </Text>
        <Text style={styles.statSubtext}>{formatSessionCount(todayStats?.sessionCount || 0, locale)}</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statLabel}>{t('statsWeekly', locale)}</Text>
        <Text style={styles.statValue}>{formatStatsDuration(weeklyTotal, locale)}</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statLabel}>{t('statsStreak', locale)}</Text>
        <Text style={styles.statValue}>{formatStreakDays(streak, locale)}</Text>
        {streak > 0 && (
          <Text style={styles.statSubtext}>{t('statsKeepGoing', locale)}</Text>
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
