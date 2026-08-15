import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming, Easing } from 'react-native-reanimated';
import { SlideShell } from './SlideShell';
import { colors } from '../../../constants/colors';
import { typography } from '../../../constants/typography';
import { WrappedData } from '../../../types/wrapped';
import { moderateScale, scaleFont } from '../../../utils/sizer';

const GUESS_OPTIONS = [
  { key: 'top5', label: 'Top 5%', max: 5 },
  { key: 'top15', label: 'Top 15%', max: 15 },
  { key: 'top30', label: 'Top 30%', max: 30 },
  { key: 'rest', label: 'Top 50%+', max: 100 },
] as const;

type GuessKey = (typeof GUESS_OPTIONS)[number]['key'];

function bucketIndexForRank(rank: number): number {
  return GUESS_OPTIONS.findIndex(o => rank <= o.max);
}

function comparisonMessage(guessIndex: number, actualIndex: number): string {
  if (guessIndex === actualIndex) return "Nailed it — spot on! \u{1F3AF}";
  if (actualIndex < guessIndex) return "You're actually better than you guessed! \u{1F680}";
  return "A touch more modest than your guess — still solid \u{1F4AA}";
}

type Props = {
  data: WrappedData;
  active: boolean;
  onAwaitingGuessChange?: (awaiting: boolean) => void;
};

export function RankSlide({ data, active, onAwaitingGuessChange }: Props) {
  const [guess, setGuess] = useState<GuessKey | null>(null);
  const width = useSharedValue(0);
  const topPct = 100 - data.percentileRank;
  const revealed = guess !== null;

  useEffect(() => {
    onAwaitingGuessChange?.(active && !revealed);
    return () => onAwaitingGuessChange?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, revealed]);

  useEffect(() => {
    width.value = active && revealed
      ? withDelay(250, withTiming(topPct, { duration: 900, easing: Easing.out(Easing.cubic) }))
      : 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, revealed]);

  const barStyle = useAnimatedStyle(() => ({ width: `${width.value}%` }));

  const guessIndex = guess ? GUESS_OPTIONS.findIndex(o => o.key === guess) : -1;
  const actualIndex = bucketIndexForRank(data.percentileRank);

  return (
    <SlideShell
      active={active}
      footer={
        !revealed ? (
          <View style={styles.guessRow}>
            {GUESS_OPTIONS.map(o => (
              <Pressable
                key={o.key}
                onPress={() => setGuess(o.key)}
                style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
                accessibilityRole="button"
                accessibilityLabel={`Guess ${o.label}`}
              >
                <Text style={styles.chipText}>{o.label}</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.resultRow}>
            <Text style={styles.resultText}>
              You guessed {GUESS_OPTIONS[guessIndex].label} — {comparisonMessage(guessIndex, actualIndex)}
            </Text>
          </View>
        )
      }
    >
      {!revealed ? (
        <>
          <Text style={styles.label}>Before we reveal it</Text>
          <Text style={styles.headline}>Where do you rank?</Text>
          <Text style={styles.sub}>Guess your percentile among BlinkMoney savers this year</Text>
          <View style={styles.barTrack} />
          <View style={styles.guessHint}>
            <Text style={styles.guessHintEmoji}>{'\u{1F914}'}</Text>
            <Text style={styles.guessHintText}>Make your guess below to unlock your rank</Text>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.label}>You're in the</Text>
          <Text style={styles.headline}>top {data.percentileRank}%</Text>
          <Text style={styles.sub}>of BlinkMoney savers this year</Text>

          <View style={styles.barTrack}>
            <Animated.View style={[styles.barFill, barStyle]} />
          </View>

          <View style={styles.personalityCard}>
            <Text style={styles.personalityEmoji}>{data.personalityEmoji}</Text>
            <View style={styles.personalityTextWrap}>
              <Text style={styles.personalityLabel}>Your money personality</Text>
              <Text style={styles.personalityValue}>{data.personality}</Text>
            </View>
          </View>
        </>
      )}
    </SlideShell>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.h2,
    color: colors.textMuted,
  },
  headline: {
    ...typography.display,
    color: colors.lime,
    marginVertical: moderateScale(4),
  },
  sub: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: moderateScale(24),
  },
  barTrack: {
    height: moderateScale(10),
    borderRadius: moderateScale(6),
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
    marginBottom: moderateScale(32),
  },
  barFill: {
    height: '100%',
    borderRadius: moderateScale(6),
    backgroundColor: colors.lime,
  },
  personalityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: moderateScale(18),
    padding: moderateScale(18),
    borderWidth: 1,
    borderColor: colors.border,
  },
  personalityEmoji: {
    fontSize: scaleFont(32),
    marginRight: moderateScale(14),
  },
  personalityTextWrap: {
    flex: 1,
  },
  personalityLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: moderateScale(2),
  },
  personalityValue: {
    ...typography.h2,
    color: colors.white,
  },
  guessHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: moderateScale(18),
    padding: moderateScale(18),
    borderWidth: 1,
    borderColor: colors.border,
  },
  guessHintEmoji: {
    fontSize: scaleFont(24),
    marginRight: moderateScale(12),
  },
  guessHintText: {
    ...typography.body,
    color: colors.textMuted,
    flex: 1,
  },
  guessRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(8),
  },
  chip: {
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgCard,
  },
  chipPressed: {
    opacity: 0.7,
    borderColor: colors.lime,
  },
  chipText: {
    ...typography.bodyStrong,
    color: colors.white,
  },
  resultRow: {
    paddingVertical: moderateScale(4),
  },
  resultText: {
    ...typography.bodyStrong,
    color: colors.lime,
  },
});
