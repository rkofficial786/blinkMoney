import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  BackHandler,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StoryProgressBar } from './StoryProgressBar';
import { IntroSlide } from './slides/IntroSlide';
import { StreakSlide } from './slides/StreakSlide';
import { GrowthSlide } from './slides/GrowthSlide';
import { MilestoneSlide } from './slides/MilestoneSlide';
import { RankSlide } from './slides/RankSlide';
import { ReferralSlide } from './slides/ReferralSlide';
import { ShareSlide } from './slides/ShareSlide';
import { useWrappedData } from './useWrappedData';
import { WrappedScenario } from '../../types/wrapped';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { moderateScale, scaleFont, scaleHeight } from '../../utils/sizer';

const SLIDE_DURATION_MS = 5000;

type Props = {
  scenario: WrappedScenario;
  onExit: () => void;
};

export function WrappedScreen({ scenario, onExit }: Props) {
  const { status, data, error, retry } = useWrappedData(scenario);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHeld, setIsHeld] = useState(false);
  const [isAwaitingGuess, setIsAwaitingGuess] = useState(false);
  const isPaused = isHeld || isAwaitingGuess;
  const dragY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onExit();
      return true;
    });
    return () => subscription.remove();
  }, [onExit]);

  const slides = useMemo(() => {
    if (!data) return [];
    return [
      (active: boolean) => <IntroSlide data={data} active={active} />,
      (active: boolean) => <StreakSlide data={data} active={active} />,
      (active: boolean) => <GrowthSlide data={data} active={active} />,
      (active: boolean) => <MilestoneSlide data={data} active={active} />,
      (active: boolean) => (
        <RankSlide data={data} active={active} onAwaitingGuessChange={setIsAwaitingGuess} />
      ),
      (active: boolean) => <ReferralSlide data={data} active={active} />,
      (active: boolean) => <ShareSlide data={data} active={active} onDone={onExit} />,
    ];
  }, [data, onExit]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dy) > 12 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) dragY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 110) {
          onExit();
        } else {
          Animated.spring(dragY, { toValue: 0, useNativeDriver: true, friction: 8 }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(dragY, { toValue: 0, useNativeDriver: true, friction: 8 }).start();
      },
    }),
  ).current;

  const goNext = () => {
    setActiveIndex(i => Math.min(i + 1, slides.length - 1));
  };
  const goPrev = () => {
    setActiveIndex(i => Math.max(i - 1, 0));
  };
  const handleSegmentComplete = () => {
    if (activeIndex < slides.length - 1) goNext();
  };

  if (status === 'loading') {
    return (
      <SafeAreaView style={styles.centerFill} edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color={colors.lime} />
        <Text style={styles.loadingText}>Building your Wrapped…</Text>
      </SafeAreaView>
    );
  }

  if (status === 'error') {
    return (
      <SafeAreaView style={styles.centerFill} edges={['top', 'bottom']}>
        <Text style={styles.errorEmoji}>⚠️</Text>
        <Text style={styles.errorTitle}>Couldn't load your Wrapped</Text>
        <Text style={styles.errorSub}>{error}</Text>
        <View style={styles.errorActions}>
          <Pressable style={styles.retryBtn} onPress={retry} accessibilityRole="button">
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
          <Pressable style={styles.backBtn} onPress={onExit} accessibilityRole="button">
            <Text style={styles.backText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <Animated.View style={[styles.fill, { transform: [{ translateY: dragY }] }]} {...panResponder.panHandlers}>
      <SafeAreaView style={styles.fill} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <StoryProgressBar
            count={slides.length}
            activeIndex={activeIndex}
            isPaused={isPaused}
            durationMs={SLIDE_DURATION_MS}
            onSegmentComplete={handleSegmentComplete}
          />
          <Pressable onPress={onExit} hitSlop={12} style={styles.closeBtn} accessibilityRole="button" accessibilityLabel="Close">
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        <View style={styles.slideArea}>
          {slides.map((render, i) => (
            <View key={i} style={[StyleSheet.absoluteFill, { display: i === activeIndex ? 'flex' : 'none' }]}>
              {render(i === activeIndex)}
            </View>
          ))}

          <View style={styles.tapZones} pointerEvents="box-none">
            <Pressable
              style={styles.tapZoneLeft}
              onPress={goPrev}
              onLongPress={() => setIsHeld(true)}
              onPressOut={() => setIsHeld(false)}
              delayLongPress={180}
            />
            <Pressable
              style={styles.tapZoneRight}
              onPress={goNext}
              onLongPress={() => setIsHeld(true)}
              onPressOut={() => setIsHeld(false)}
              delayLongPress={180}
            />
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.bg },
  centerFill: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(32),
  },
  loadingText: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: moderateScale(16),
  },
  errorEmoji: { fontSize: scaleFont(40), marginBottom: moderateScale(16) },
  errorTitle: {
    ...typography.h2,
    color: colors.white,
    marginBottom: moderateScale(8),
    textAlign: 'center',
  },
  errorSub: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: moderateScale(28),
  },
  errorActions: {
    flexDirection: 'row',
    gap: moderateScale(12),
  },
  retryBtn: {
    backgroundColor: colors.lime,
    borderRadius: moderateScale(14),
    paddingVertical: moderateScale(13),
    paddingHorizontal: moderateScale(22),
  },
  retryText: {
    ...typography.bodyStrong,
    color: colors.bg,
    fontWeight: '800',
  },
  backBtn: {
    borderRadius: moderateScale(14),
    paddingVertical: moderateScale(13),
    paddingHorizontal: moderateScale(22),
    borderWidth: 1,
    borderColor: colors.border,
  },
  backText: {
    ...typography.bodyStrong,
    color: colors.textMuted,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(12),
    paddingTop: moderateScale(8),
    gap: moderateScale(12),
  },
  closeBtn: {
    width: moderateScale(28),
    height: moderateScale(28),
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: colors.white,
    fontSize: scaleFont(16),
  },
  slideArea: {
    flex: 1,
  },
  tapZones: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: scaleHeight(120),
    flexDirection: 'row',
  },
  tapZoneLeft: {
    flex: 1,
  },
  tapZoneRight: {
    flex: 2,
  },
});
