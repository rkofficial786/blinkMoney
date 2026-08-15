import React from 'react';
import { Pressable, Share, StyleSheet, Text } from 'react-native';
import { SlideShell } from './SlideShell';
import { colors } from '../../../constants/colors';
import { typography } from '../../../constants/typography';
import { WrappedData } from '../../../types/wrapped';
import { moderateScale, scaleFont } from '../../../utils/sizer';

export function ReferralSlide({ data, active }: { data: WrappedData; active: boolean }) {
  const handleInvite = async () => {
    try {
      await Share.share({
        message:
          `I just hit a ${data.streakDays}-day saving streak on BlinkMoney 🔥 ` +
          `Join me and start your own money story: https://blinkmoney.in/invite/raj`,
      });
    } catch {
      // user cancelled or share failed silently — no action needed
    }
  };

  return (
    <SlideShell
      active={active}
      footer={
        <Pressable
          onPress={handleInvite}
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          accessibilityRole="button"
          accessibilityLabel="Invite a friend to BlinkMoney"
        >
          <Text style={styles.ctaText}>Invite a friend →</Text>
        </Pressable>
      }
    >
      <Text style={styles.emoji}>🤝</Text>
      <Text style={styles.headline}>
        {data.referralsInvited > 0
          ? `You've brought ${data.referralsInvited} friend${data.referralsInvited > 1 ? 's' : ''} along`
          : 'Nobody starts a streak alone'}
      </Text>
      <Text style={styles.sub}>
        Be the one who gets your friend saving. Invite them and you'll both get a bonus when they start.
      </Text>
    </SlideShell>
  );
}

const styles = StyleSheet.create({
  emoji: { fontSize: scaleFont(48), marginBottom: moderateScale(20) },
  headline: {
    ...typography.h1,
    color: colors.white,
    marginBottom: moderateScale(12),
  },
  sub: {
    ...typography.body,
    color: colors.textMuted,
  },
  cta: {
    backgroundColor: colors.lime,
    borderRadius: moderateScale(16),
    paddingVertical: moderateScale(16),
    alignItems: 'center',
  },
  ctaPressed: {
    opacity: 0.85,
  },
  ctaText: {
    ...typography.bodyStrong,
    color: colors.bg,
    fontWeight: '800',
  },
});
