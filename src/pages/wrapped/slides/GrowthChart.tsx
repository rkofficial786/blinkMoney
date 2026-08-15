import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming, Easing } from 'react-native-reanimated';
import { MonthlyPoint } from '../../../types/wrapped';
import { colors } from '../../../constants/colors';
import { typography } from '../../../constants/typography';
import { moderateScale, scaleHeight } from '../../../utils/sizer';

type Props = {
  data: MonthlyPoint[];
  active: boolean;
};

export function GrowthChart({ data, active }: Props) {
  const max = Math.max(...data.map(d => d.amount));

  return (
    <View style={styles.chart}>
      {data.map((point, i) => (
        <Bar key={point.label} point={point} max={max} index={i} active={active} />
      ))}
    </View>
  );
}

function Bar({ point, max, index, active }: { point: MonthlyPoint; max: number; index: number; active: boolean }) {
  const height = useSharedValue(0);
  const targetPct = (point.amount / max) * 100;

  useEffect(() => {
    if (!active) {
      height.value = 0;
      return;
    }
    height.value = withDelay(
      200 + index * 90,
      withTiming(targetPct, { duration: 650, easing: Easing.out(Easing.cubic) }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const style = useAnimatedStyle(() => ({ height: `${height.value}%` }));
  const isLast = index === 6;

  return (
    <View style={styles.barColumn}>
      <View style={styles.barTrack}>
        <Animated.View style={[styles.barFill, style, isLast && styles.barFillHighlight]} />
      </View>
      <Text style={styles.barLabel}>{point.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: scaleHeight(180),
    gap: moderateScale(10),
    paddingHorizontal: moderateScale(4),
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: '100%',
    height: scaleHeight(150),
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: moderateScale(6),
    backgroundColor: 'rgba(168, 255, 61, 0.35)',
    minHeight: 4,
  },
  barFillHighlight: {
    backgroundColor: colors.lime,
  },
  barLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: moderateScale(8),
  },
});
