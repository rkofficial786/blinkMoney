import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SlideShell } from './SlideShell';
import { colors } from '../../../constants/colors';
import { typography } from '../../../constants/typography';
import { WrappedData } from '../../../types/wrapped';
import { moderateScale } from '../../../utils/sizer';

export function IntroSlide({ data, active }: { data: WrappedData; active: boolean }) {
  return (
    <SlideShell active={active}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>YOUR MONEY WRAPPED</Text>
      </View>
      <Text style={styles.greeting}>Hey {data.userName} 👋</Text>
      <Text style={styles.headline}>Your money had a big year.</Text>
      <Text style={styles.sub}>{data.periodLabel} · Let's look back at it</Text>
    </SlideShell>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.limeMuted,
    borderRadius: moderateScale(20),
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(7),
    marginBottom: moderateScale(28),
  },
  badgeText: {
    ...typography.caption,
    color: colors.lime,
    letterSpacing: 1,
    fontWeight: '700',
  },
  greeting: {
    ...typography.h1,
    color: colors.white,
    marginBottom: moderateScale(8),
  },
  headline: {
    ...typography.display,
    color: colors.white,
    marginBottom: moderateScale(16),
  },
  sub: {
    ...typography.body,
    color: colors.textMuted,
  },
});
