import React, { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Share from 'react-native-share';
import LinearGradient from 'react-native-linear-gradient';
import ViewShot, { ViewShotRef } from 'react-native-view-shot';
import { SlideShell } from './SlideShell';
import { formatInr } from '../../../utils/format';
import { colors } from '../../../constants/colors';
import { typography } from '../../../constants/typography';
import { WrappedData } from '../../../types/wrapped';
import { moderateScale, scaleFont, scaleWidth } from '../../../utils/sizer';
import { Logo } from '../../../components/Logo';

type Props = {
  data: WrappedData;
  active: boolean;
  onDone: () => void;
};

export function ShareSlide({ data, active, onDone }: Props) {
  const viewShotRef = useRef<ViewShotRef>(null);
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    if (!viewShotRef.current?.capture) return;
    setSharing(true);
    try {
      const uri = await viewShotRef.current.capture();
      await Share.open({
        url: uri,
        message: 'My BlinkMoney Wrapped ✨ blinkmoney.in',
        failOnCancel: false,
      });
    } catch {
      Alert.alert('Could not share', 'Something went wrong creating your card. Please try again.');
    } finally {
      setSharing(false);
    }
  };

  return (
    <SlideShell
      active={active}
      footer={
        <View style={styles.footerRow}>
          <Pressable onPress={onDone} style={styles.secondaryBtn} accessibilityRole="button">
            <Text style={styles.secondaryText}>Done</Text>
          </Pressable>
          <Pressable
            onPress={handleShare}
            disabled={sharing}
            style={({ pressed }) => [styles.primaryBtn, (pressed || sharing) && styles.primaryBtnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Share your Wrapped card"
          >
            <Text style={styles.primaryText}>{sharing ? 'Preparing…' : 'Share your card ↗'}</Text>
          </Pressable>
        </View>
      }
    >
      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
        <LinearGradient colors={[colors.bgAlt, colors.bg]} style={styles.card}>
          <Logo width={scaleWidth(90)} style={styles.cardBrand} />
          <Text style={styles.cardTitle}>{data.userName}'s Money Wrapped</Text>
          <Text style={styles.cardPeriod}>{data.periodLabel}</Text>

          <View style={styles.statGrid}>
            <Stat label="Streak" value={`${data.streakDays}d`} />
            <Stat label="Saved" value={formatInr(data.totalSaved)} />
            <Stat label="Growth" value={`+${data.growthPercent.toFixed(0)}%`} />
            <Stat label="Rank" value={`Top ${data.percentileRank}%`} />
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.cardFooterText}>{data.personalityEmoji} {data.personality}</Text>
          </View>
        </LinearGradient>
      </ViewShot>
    </SlideShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCell}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: moderateScale(24),
    padding: moderateScale(26),
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardBrand: {
    marginBottom: moderateScale(18),
  },
  cardTitle: {
    ...typography.h1,
    fontSize: scaleFont(24),
    color: colors.white,
    marginBottom: moderateScale(4),
  },
  cardPeriod: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: moderateScale(24),
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(14),
    marginBottom: moderateScale(20),
  },
  statCell: {
    width: '46%',
  },
  statValue: {
    ...typography.h1,
    fontSize: scaleFont(26),
    color: colors.lime,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: moderateScale(16),
  },
  cardFooterText: {
    ...typography.bodyStrong,
    color: colors.white,
  },
  footerRow: {
    flexDirection: 'row',
    gap: moderateScale(12),
  },
  secondaryBtn: {
    paddingVertical: moderateScale(16),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryText: {
    ...typography.bodyStrong,
    color: colors.textMuted,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: colors.lime,
    borderRadius: moderateScale(16),
    paddingVertical: moderateScale(16),
    alignItems: 'center',
  },
  primaryBtnPressed: {
    opacity: 0.85,
  },
  primaryText: {
    ...typography.bodyStrong,
    color: colors.bg,
    fontWeight: '800',
  },
});
