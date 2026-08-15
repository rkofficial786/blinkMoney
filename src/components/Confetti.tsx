import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../constants/colors';
import { moderateScale, scaleHeight, scaleWidth } from '../utils/sizer';

const PIECE_COLORS = [colors.lime, colors.limeDark, colors.white, colors.paleMint];
const COUNT = 22;

type Props = { active: boolean };

export function Confetti({ active }: Props) {
  const { width } = useWindowDimensions();

  const pieces = useMemo(
    () =>
      Array.from({ length: COUNT }).map((_, i) => ({
        id: i,
        startX: Math.random() * width,
        drift: (Math.random() - 0.5) * scaleWidth(120),
        delay: Math.random() * 250,
        duration: 1400 + Math.random() * 700,
        size: scaleWidth(6) + Math.random() * scaleWidth(6),
        color: PIECE_COLORS[i % PIECE_COLORS.length],
        rotate: Math.random() * 360,
      })),
    [width],
  );

  if (!active) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {pieces.map(piece => (
        <Piece key={piece.id} {...piece} />
      ))}
    </View>
  );
}

function Piece({
  startX,
  drift,
  delay,
  duration,
  size,
  color,
  rotate,
}: {
  startX: number;
  drift: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  rotate: number;
}) {
  const progress = useSharedValue(0);
  const fallDistance = scaleHeight(420);
  const startOffset = scaleHeight(40);

  useEffect(() => {
    progress.value = withDelay(delay, withTiming(1, { duration, easing: Easing.out(Easing.quad) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [
      { translateY: progress.value * fallDistance - startOffset },
      { translateX: drift * progress.value },
      { rotate: `${rotate + progress.value * 180}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.piece,
        style,
        { left: startX, width: size, height: size * 1.6, backgroundColor: color },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  piece: {
    position: 'absolute',
    top: 0,
    borderRadius: moderateScale(2),
  },
});
