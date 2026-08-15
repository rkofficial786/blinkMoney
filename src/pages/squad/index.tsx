import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import RNShare from 'react-native-share';
import LinearGradient from 'react-native-linear-gradient';
import ViewShot, { ViewShotRef } from 'react-native-view-shot';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { Confetti } from '../../components/Confetti';
import { Leaderboard } from './Leaderboard';
import { Logo } from '../../components/Logo';
import { useSquadData } from './useSquadData';
import { formatInr } from '../../utils/format';
import { SquadScenario } from '../../types/squad';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { moderateScale, scaleFont, scaleWidth } from '../../utils/sizer';

type Props = {
  scenario: SquadScenario;
  onExit: () => void;
};

export function SquadScreen({ scenario, onExit }: Props) {
  const { status, data, error, setData, retry } = useSquadData(scenario);
  const [sharing, setSharing] = useState(false);
  const viewShotRef = useRef<ViewShotRef>(null);
  const goalWidth = useSharedValue(0);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onExit();
      return true;
    });
    return () => subscription.remove();
  }, [onExit]);

  const totalSaved = data ? data.members.reduce((sum, m) => sum + m.contribution, 0) : 0;

  React.useEffect(() => {
    if (!data) return;
    const pct = Math.min((totalSaved / data.goalAmount) * 100, 100);
    goalWidth.value = withTiming(pct, { duration: 800, easing: Easing.out(Easing.cubic) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSaved, data?.goalAmount]);

  const goalBarStyle = useAnimatedStyle(() => ({ width: `${goalWidth.value}%` }));

  const handleLogSave = () => {
    if (!data || data.todayLogged) return;
    setData(d => {
      const members = d.members.map(m => (m.isYou ? { ...m, contribution: m.contribution + d.logAmount } : m));
      const total = members.reduce((sum, m) => sum + m.contribution, 0);
      return {
        ...d,
        members,
        todayLogged: true,
        status: total >= d.goalAmount ? 'completed' : d.status,
      };
    });
  };

  const handleInvite = async () => {
    if (!data) return;
    try {
      await Share.share({
        message:
          `Join my "${data.challengeName}" squad on BlinkMoney \u{1F4B0} We're ${formatInr(totalSaved)} of the way there — save with us: https://blinkmoney.in/squad/invite`,
      });
    } catch {
      // user cancelled or share failed silently
    }
  };

  const handleShareWin = async () => {
    if (!viewShotRef.current?.capture) return;
    setSharing(true);
    try {
      const uri = await viewShotRef.current.capture();
      await RNShare.open({ url: uri, message: 'Our squad just smashed our savings goal on BlinkMoney \u{1F389}', failOnCancel: false });
    } catch {
      Alert.alert('Could not share', 'Something went wrong creating your card. Please try again.');
    } finally {
      setSharing(false);
    }
  };

  if (status === 'loading') {
    return (
      <SafeAreaView style={styles.centerFill} edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color={colors.lime} />
        <Text style={styles.loadingText}>Loading your squad…</Text>
      </SafeAreaView>
    );
  }

  if (status === 'error') {
    return (
      <SafeAreaView style={styles.centerFill} edges={['top', 'bottom']}>
        <Text style={styles.errorEmoji}>⚠️</Text>
        <Text style={styles.errorTitle}>Couldn't load your squad</Text>
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

  if (!data) return null;

  if (data.status === 'expired') {
    return (
      <SafeAreaView style={styles.centerFill} edges={['top', 'bottom']}>
        <Text style={styles.errorEmoji}>⏳</Text>
        <Text style={styles.errorTitle}>This challenge has ended</Text>
        <Text style={styles.errorSub}>
          Your squad saved {formatInr(totalSaved)} of {formatInr(data.goalAmount)}. So close — start a fresh one?
        </Text>
        <View style={styles.errorActions}>
          <Pressable style={styles.retryBtn} onPress={onExit} accessibilityRole="button">
            <Text style={styles.retryText}>Start new challenge</Text>
          </Pressable>
          <Pressable style={styles.backBtn} onPress={onExit} accessibilityRole="button">
            <Text style={styles.backText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (data.status === 'completed') {
    return (
      <SafeAreaView style={styles.fill} edges={['top', 'bottom']}>
        <Confetti active />
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.winEmoji}>🎉</Text>
          <Text style={styles.winHeadline}>Squad goal smashed!</Text>
          <Text style={styles.winSub}>
            You and your squad hit {formatInr(data.goalAmount)} together
          </Text>

          <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
            <LinearGradient colors={[colors.bgAlt, colors.bg]} style={styles.card}>
              <Logo width={scaleWidth(80)} style={styles.cardBrand} />
              <Text style={styles.cardTitle}>{data.challengeName}</Text>
              <Text style={styles.cardAmount}>{formatInr(totalSaved)}</Text>
              <Text style={styles.cardCaption}>saved together by {data.members.length} savers</Text>
            </LinearGradient>
          </ViewShot>

          <View style={styles.winActions}>
            <Pressable style={styles.backBtn} onPress={onExit} accessibilityRole="button">
              <Text style={styles.backText}>Done</Text>
            </Pressable>
            <Pressable
              onPress={handleShareWin}
              disabled={sharing}
              style={({ pressed }) => [styles.retryBtn, styles.shareBtn, (pressed || sharing) && styles.btnPressed]}
              accessibilityRole="button"
              accessibilityLabel="Share your squad win"
            >
              <Text style={styles.retryText}>{sharing ? 'Preparing…' : 'Share the win ↗'}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.fill} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Squad Save</Text>
        <Pressable onPress={onExit} hitSlop={12} style={styles.closeBtn} accessibilityRole="button" accessibilityLabel="Close">
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.challengeName}>{data.challengeName}</Text>
        <Text style={styles.daysRemaining}>
          {data.daysRemaining === 0 ? 'Last day!' : `${data.daysRemaining} days left`}
        </Text>

        <View style={styles.goalRow}>
          <Text style={styles.goalAmount}>{formatInr(totalSaved)}</Text>
          <Text style={styles.goalTarget}> / {formatInr(data.goalAmount)}</Text>
        </View>
        <View style={styles.goalTrack}>
          <Animated.View style={[styles.goalFill, goalBarStyle]} />
        </View>

        <Leaderboard members={data.members} />

        <Pressable
          onPress={handleLogSave}
          disabled={data.todayLogged}
          style={({ pressed }) => [
            styles.logBtn,
            data.todayLogged && styles.logBtnDone,
            pressed && !data.todayLogged && styles.btnPressed,
          ]}
          accessibilityRole="button"
        >
          <Text style={[styles.logBtnText, data.todayLogged && styles.logBtnTextDone]}>
            {data.todayLogged ? `✓ Logged today's ${formatInr(data.logAmount)} save` : `+ Log today's save (${formatInr(data.logAmount)})`}
          </Text>
        </Pressable>

        <Pressable onPress={handleInvite} style={styles.inviteBtn} accessibilityRole="button" accessibilityLabel="Invite a friend to your squad">
          <Text style={styles.inviteBtnText}>Invite a friend →</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
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
  btnPressed: {
    opacity: 0.85,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(24),
    paddingTop: moderateScale(8),
  },
  headerTitle: {
    ...typography.h2,
    color: colors.white,
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
  scroll: {
    padding: moderateScale(24),
    paddingBottom: moderateScale(48),
  },
  challengeName: {
    ...typography.h1,
    color: colors.white,
    marginTop: moderateScale(12),
    marginBottom: moderateScale(4),
  },
  daysRemaining: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: moderateScale(20),
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: moderateScale(10),
  },
  goalAmount: {
    ...typography.stat,
    fontSize: scaleFont(36),
    color: colors.lime,
  },
  goalTarget: {
    ...typography.body,
    color: colors.textMuted,
  },
  goalTrack: {
    height: moderateScale(12),
    borderRadius: moderateScale(6),
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    marginBottom: moderateScale(28),
  },
  goalFill: {
    height: '100%',
    borderRadius: moderateScale(6),
    backgroundColor: colors.lime,
  },
  logBtn: {
    backgroundColor: colors.lime,
    borderRadius: moderateScale(16),
    paddingVertical: moderateScale(16),
    alignItems: 'center',
    marginTop: moderateScale(24),
  },
  logBtnDone: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logBtnText: {
    ...typography.bodyStrong,
    color: colors.bg,
    fontWeight: '800',
  },
  logBtnTextDone: {
    color: colors.textMuted,
    fontWeight: '600',
  },
  inviteBtn: {
    alignItems: 'center',
    paddingVertical: moderateScale(16),
    marginTop: moderateScale(12),
  },
  inviteBtnText: {
    ...typography.bodyStrong,
    color: colors.lime,
  },
  winEmoji: {
    fontSize: scaleFont(48),
    textAlign: 'center',
    marginBottom: moderateScale(16),
  },
  winHeadline: {
    ...typography.h1,
    color: colors.white,
    textAlign: 'center',
    marginBottom: moderateScale(8),
  },
  winSub: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: moderateScale(28),
  },
  card: {
    borderRadius: moderateScale(24),
    padding: moderateScale(26),
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cardBrand: {
    marginBottom: moderateScale(20),
  },
  cardTitle: {
    ...typography.h2,
    color: colors.white,
    marginBottom: moderateScale(12),
    textAlign: 'center',
  },
  cardAmount: {
    ...typography.stat,
    fontSize: scaleFont(40),
    color: colors.lime,
    marginBottom: moderateScale(6),
  },
  cardCaption: {
    ...typography.caption,
    color: colors.textMuted,
  },
  winActions: {
    flexDirection: 'row',
    gap: moderateScale(12),
    marginTop: moderateScale(28),
    justifyContent: 'center',
  },
  shareBtn: {
    flex: 1,
    alignItems: 'center',
  },
});
