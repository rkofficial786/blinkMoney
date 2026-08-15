import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SlideShell } from './SlideShell';
import { Confetti } from '../../../components/Confetti';
import { formatInr } from '../../../utils/format';
import { colors } from '../../../constants/colors';
import { typography } from '../../../constants/typography';
import { WrappedData } from '../../../types/wrapped';
import { moderateScale, scaleFont } from '../../../utils/sizer';

export function MilestoneSlide({ data, active }: { data: WrappedData; active: boolean }) {
  return (
    <SlideShell active={active}>
      <Confetti active={active} />
      <View style={styles.medal}>
        <Text style={styles.medalEmoji}>🏆</Text>
      </View>
      <Text style={styles.label}>Milestone unlocked</Text>
      <Text style={styles.amount}>{formatInr(data.milestoneAmount)}</Text>
      <Text style={styles.sub}>{data.milestoneLabel}</Text>
    </SlideShell>
  );
}

const styles = StyleSheet.create({
  medal: {
    width: moderateScale(72),
    height: moderateScale(72),
    borderRadius: moderateScale(36),
    backgroundColor: colors.limeMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScale(24),
  },
  medalEmoji: {
    fontSize: scaleFont(34),
  },
  label: {
    ...typography.h2,
    color: colors.textMuted,
    marginBottom: moderateScale(10),
  },
  amount: {
    ...typography.stat,
    color: colors.white,
    fontSize: scaleFont(44),
    marginBottom: moderateScale(12),
  },
  sub: {
    ...typography.bodyStrong,
    color: colors.lime,
  },
});
