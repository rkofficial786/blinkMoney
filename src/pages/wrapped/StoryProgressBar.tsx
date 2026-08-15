import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { moderateScale } from '../../utils/sizer';

type Props = {
  count: number;
  activeIndex: number;
  isPaused: boolean;
  durationMs: number;
  onSegmentComplete: () => void;
};

export function StoryProgressBar({ count, activeIndex, isPaused, durationMs, onSegmentComplete }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }).map((_, i) => (
        <Segment
          key={i}
          state={i < activeIndex ? 'done' : i === activeIndex ? 'active' : 'pending'}
          isPaused={isPaused}
          durationMs={durationMs}
          onComplete={onSegmentComplete}
        />
      ))}
    </View>
  );
}

function Segment({
  state,
  isPaused,
  durationMs,
  onComplete,
}: {
  state: 'done' | 'active' | 'pending';
  isPaused: boolean;
  durationMs: number;
  onComplete: () => void;
}) {
  const progress = useSharedValue(state === 'done' ? 1 : 0);

  useEffect(() => {
    if (state === 'done') {
      progress.value = withTiming(1, { duration: 150 });
      return;
    }
    if (state === 'pending') {
      progress.value = 0;
      return;
    }
    // active
    progress.value = 0;
    if (!isPaused) {
      progress.value = withTiming(
        1,
        { duration: durationMs, easing: Easing.linear },
        finished => {
          if (finished) runOnJS(onComplete)();
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    if (state !== 'active') return;
    if (isPaused) {
      progress.value = withTiming(progress.value, { duration: 0 });
    } else {
      const remaining = durationMs * (1 - progress.value);
      progress.value = withTiming(
        1,
        { duration: remaining, easing: Easing.linear },
        finished => {
          if (finished) runOnJS(onComplete)();
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused]);

  const style = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, style]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: moderateScale(4),
    paddingHorizontal: moderateScale(4),
  },
  track: {
    flex: 1,
    height: moderateScale(3),
    borderRadius: moderateScale(2),
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.lime,
    borderRadius: moderateScale(2),
  },
});
