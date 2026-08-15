import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SlideShell } from './SlideShell';
import { AnimatedNumber } from './AnimatedNumber';
import { GrowthChart } from './GrowthChart';
import { formatInr } from '../../../utils/format';
import { colors } from '../../../constants/colors';
import { typography } from '../../../constants/typography';
import { WrappedData } from '../../../types/wrapped';
import { moderateScale, scaleFont } from '../../../utils/sizer';

export function GrowthSlide({ data, active }: { data: WrappedData; active: boolean }) {
  return (
    <SlideShell active={active} contentStyle={styles.content}>
      <Text style={styles.label}>Your money grew</Text>
      <View style={styles.statRow}>
        <AnimatedNumber
          toValue={data.growthPercent}
          formatter={n => `+${n.toFixed(1)}%`}
          style={styles.stat}
          delay={150}
        />
      </View>
      <Text style={styles.sub}>
        From ₹0 to <Text style={styles.subStrong}>{formatInr(data.totalSaved)}</Text> saved
      </Text>
      <View style={styles.chartWrap}>
        <GrowthChart data={data.monthly} active={active} />
      </View>
    </SlideShell>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
  },
  label: {
    ...typography.h2,
    color: colors.textMuted,
    marginBottom: moderateScale(12),
  },
  statRow: {
    marginBottom: moderateScale(12),
  },
  stat: {
    ...typography.stat,
    color: colors.lime,
    fontSize: scaleFont(48),
  },
  sub: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: moderateScale(28),
  },
  subStrong: {
    color: colors.white,
    fontWeight: '700',
  },
  chartWrap: {
    marginTop: moderateScale(4),
  },
});
