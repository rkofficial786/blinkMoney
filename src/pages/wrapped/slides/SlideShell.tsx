import React, { ReactNode, useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { colors } from '../../../constants/colors';
import { moderateScale } from '../../../utils/sizer';

type Props = {
  children: ReactNode;
  active: boolean;
  footer?: ReactNode;
  contentStyle?: ViewStyle;
};

export function SlideShell({ children, active, footer, contentStyle }: Props) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    if (active) {
      opacity.value = withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) });
      translateY.value = withTiming(0, { duration: 420, easing: Easing.out(Easing.cubic) });
    } else {
      opacity.value = 0;
      translateY.value = 16;
    }
  }, [active, opacity, translateY]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <LinearGradient colors={[colors.bgAlt, colors.bg]} style={styles.fill}>
      <Animated.View style={[styles.content, style, contentStyle]}>{children}</Animated.View>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: moderateScale(24),
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: moderateScale(24),
    paddingBottom: moderateScale(8),
  },
});
