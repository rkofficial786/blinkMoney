import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SlideShell } from './SlideShell';
import { AnimatedNumber } from './AnimatedNumber';
import { colors } from '../../../constants/colors';
import { typography } from '../../../constants/typography';
import { WrappedData } from '../../../types/wrapped';
import { moderateScale, scaleFont } from '../../../utils/sizer';

export function StreakSlide({ data, active }: { data: WrappedData; active: boolean }) {
  const hasStreak = data.streakDays > 0;

  return (
    <SlideShell active={active}>
      <Text style={styles.emoji}>{hasStreak ? '🔥' : '🌱'}</Text>
      <Text style={styles.label}>
        {hasStreak ? 'Your saving streak' : "You're just getting started"}
      </Text>
      <View style={styles.statRow}>
        <AnimatedNumber
          toValue={hasStreak ? data.streakDays : data.longestStreak}
          formatter={n => Math.round(n).toString()}
          style={styles.stat}
          delay={200}
        />
        <Text style={styles.statUnit}>days</Text>
      </View>
      <Text style={styles.sub}>
        {hasStreak
          ? `That's ${data.streakDays} days in a row you chose your future self. Your longest streak this year was ${data.longestStreak} days.`
          : `Your longest streak so far was ${data.longestStreak} days. Start saving today to begin a new one.`}
      </Text>
    </SlideShell>
  );
}

const styles = StyleSheet.create({
  emoji: { fontSize: scaleFont(48), marginBottom: moderateScale(20) },
  label: {
    ...typography.h2,
    color: colors.textMuted,
    marginBottom: moderateScale(12),
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: moderateScale(20),
  },
  stat: {
    ...typography.stat,
    color: colors.lime,
  },
  statUnit: {
    ...typography.h2,
    color: colors.lime,
    marginLeft: moderateScale(10),
    marginBottom: moderateScale(10),
  },
  sub: {
    ...typography.body,
    color: colors.textMuted,
  },
});
