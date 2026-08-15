import React, { useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollViewInstance,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { WrappedScenario } from '../../types/wrapped';
import { SquadScenario } from '../../types/squad';
import { moderateScale, scaleFont, scaleWidth } from '../../utils/sizer';
import { Logo } from '../../components/Logo';

type Props = {
  onOpenWrapped: (scenario: WrappedScenario) => void;
  onOpenSquad: (scenario: SquadScenario) => void;
};

const SCENARIOS: { key: WrappedScenario; label: string }[] = [
  { key: 'eligible', label: 'Active saver' },
  { key: 'zeroStreak', label: 'No streak' },
  { key: 'newUser', label: 'New user' },
  { key: 'error', label: 'Server error' },
];

const SQUAD_SCENARIOS: { key: SquadScenario; label: string }[] = [
  { key: 'active', label: 'Leading' },
  { key: 'behind', label: 'Behind' },
  { key: 'completed', label: 'Completed' },
  { key: 'expired', label: 'Expired' },
  { key: 'noSquad', label: 'No squad' },
  { key: 'error', label: 'Server error' },
];

const TABS = ['Money Wrapped', 'Squad Save'] as const;

export function LandingScreen({ onOpenWrapped, onOpenSquad }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const [scenario, setScenario] = useState<WrappedScenario>('eligible');
  const isNewUser = scenario === 'newUser';
  const [squadScenario, setSquadScenario] = useState<SquadScenario>('noSquad');
  const hasSquad = squadScenario !== 'noSquad';

  const [activeTab, setActiveTab] = useState(0);
  const pagerRef = useRef<ScrollViewInstance>(null);
  const [pageHeights, setPageHeights] = useState({ wrapped: 0, squad: 0 });
  const pagerHeight = Math.max(pageHeights.wrapped, pageHeights.squad) || undefined;

  const goToTab = (index: number) => {
    setActiveTab(index);
    pagerRef.current?.scrollTo({ x: index * screenWidth, animated: true });
  };

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
    setActiveTab(index);
  };

  return (
    <SafeAreaView style={styles.fill} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.topBar}>
            <Logo width={scaleWidth(110)} />
          </View>

          <Text style={styles.greeting}>Good evening, Raj</Text>
          <Text style={styles.balanceLabel}>Total portfolio</Text>
          <Text style={styles.balance}>₹1,84,250</Text>

          <View style={styles.tabBar}>
            {TABS.map((label, index) => (
              <Pressable
                key={label}
                onPress={() => goToTab(index)}
                style={[styles.tabBtn, activeTab === index && styles.tabBtnActive]}
                accessibilityRole="button"
                accessibilityLabel={`Show ${label}`}
              >
                <Text style={[styles.tabBtnText, activeTab === index && styles.tabBtnTextActive]}>{label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <ScrollView
          ref={pagerRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumEnd}
          style={pagerHeight ? { height: pagerHeight } : undefined}
        >
          <View
            style={[styles.page, { width: screenWidth }]}
            onLayout={e => {
              const height = e.nativeEvent.layout.height;
              setPageHeights(h => ({ ...h, wrapped: height }));
            }}
          >
            {isNewUser ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyEmoji}>🔒</Text>
                <Text style={styles.emptyTitle}>Your Wrapped unlocks in 4 days</Text>
                <Text style={styles.emptySub}>
                  Keep saving daily — Wrapped needs at least 7 days of activity to tell your story.
                </Text>
                <View style={styles.emptyProgressTrack}>
                  <View style={[styles.emptyProgressFill, { width: '43%' }]} />
                </View>
              </View>
            ) : (
              <Pressable
                onPress={() => onOpenWrapped(scenario)}
                style={({ pressed }) => [styles.wrappedCardWrap, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel="Open your Money Wrapped"
              >
                <LinearGradient colors={[colors.limeDark, colors.lime]} style={styles.wrappedCard}>
                  <Text style={styles.wrappedEyebrow}>NEW · JUST FOR YOU</Text>
                  <Text style={styles.wrappedTitle}>Your 2026 Money{'\n'}Wrapped is here 🎉</Text>
                  <Text style={styles.wrappedSub}>Tap to see your saving story</Text>
                </LinearGradient>
              </Pressable>
            )}

            <View style={styles.devPanel}>
              <Text style={styles.devLabel}>Preview scenario</Text>
              <View style={styles.chipRow}>
                {SCENARIOS.map(s => (
                  <Pressable
                    key={s.key}
                    onPress={() => setScenario(s.key)}
                    style={[styles.chip, scenario === s.key && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, scenario === s.key && styles.chipTextActive]}>{s.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          <View
            style={[styles.page, { width: screenWidth }]}
            onLayout={e => {
              const height = e.nativeEvent.layout.height;
              setPageHeights(h => ({ ...h, squad: height }));
            }}
          >
            {hasSquad ? (
              <Pressable
                onPress={() => onOpenSquad(squadScenario)}
                style={({ pressed }) => [styles.squadCard, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel="Open your Squad Save challenge"
              >
                <View style={styles.squadAvatarRow}>
                  <Text style={styles.squadAvatar}>🧑</Text>
                  <Text style={[styles.squadAvatar, styles.squadAvatarOverlap]}>👩</Text>
                  <Text style={[styles.squadAvatar, styles.squadAvatarOverlap]}>🧔</Text>
                  <Text style={[styles.squadAvatar, styles.squadAvatarOverlap]}>👧</Text>
                </View>
                <Text style={styles.squadTitle}>Your squad is saving together</Text>
                <Text style={styles.squadSub}>Tap to check the leaderboard and log today's save</Text>
              </Pressable>
            ) : (
              <View style={styles.squadEmptyCard}>
                <Text style={styles.squadEmptyEmoji}>🤝</Text>
                <Text style={styles.squadEmptyTitle}>Save faster with friends</Text>
                <Text style={styles.squadEmptySub}>
                  Start a Squad Save challenge, invite friends, and hit your goal together.
                </Text>
                <Pressable
                  onPress={() => setSquadScenario('active')}
                  style={({ pressed }) => [styles.squadCreateBtn, pressed && styles.pressed]}
                  accessibilityRole="button"
                  accessibilityLabel="Create a squad"
                >
                  <Text style={styles.squadCreateBtnText}>Create a squad</Text>
                </Pressable>
              </View>
            )}

            <View style={styles.devPanel}>
              <Text style={styles.devLabel}>Preview scenario</Text>
              <View style={styles.chipRow}>
                {SQUAD_SCENARIOS.map(s => (
                  <Pressable
                    key={s.key}
                    onPress={() => setSquadScenario(s.key)}
                    style={[styles.chip, squadScenario === s.key && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, squadScenario === s.key && styles.chipTextActive]}>{s.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingBottom: moderateScale(48) },
  header: { paddingHorizontal: moderateScale(24) },
  topBar: { marginBottom: moderateScale(32) },
  greeting: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: moderateScale(4),
  },
  balanceLabel: {
    ...typography.caption,
    color: colors.textFaint,
    marginTop: moderateScale(12),
  },
  balance: {
    ...typography.display,
    color: colors.white,
    marginBottom: moderateScale(28),
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.bgCard,
    borderRadius: moderateScale(14),
    padding: moderateScale(4),
    marginBottom: moderateScale(24),
  },
  tabBtn: {
    flex: 1,
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(10),
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: colors.lime,
  },
  tabBtnText: {
    ...typography.bodyStrong,
    color: colors.textMuted,
  },
  tabBtnTextActive: {
    color: colors.bg,
    fontWeight: '800',
  },
  page: {
    paddingHorizontal: moderateScale(24),
  },
  wrappedCardWrap: {
    borderRadius: moderateScale(24),
    marginBottom: moderateScale(28),
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  wrappedCard: {
    borderRadius: moderateScale(24),
    padding: moderateScale(26),
  },
  wrappedEyebrow: {
    ...typography.caption,
    color: colors.bg,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: moderateScale(12),
    opacity: 0.7,
  },
  wrappedTitle: {
    ...typography.h1,
    color: colors.bg,
    marginBottom: moderateScale(10),
  },
  wrappedSub: {
    ...typography.bodyStrong,
    color: colors.bg,
    opacity: 0.75,
  },
  emptyCard: {
    backgroundColor: colors.bgCard,
    borderRadius: moderateScale(24),
    padding: moderateScale(26),
    marginBottom: moderateScale(28),
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyEmoji: { fontSize: scaleFont(28), marginBottom: moderateScale(14) },
  emptyTitle: {
    ...typography.h2,
    color: colors.white,
    marginBottom: moderateScale(8),
  },
  emptySub: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: moderateScale(18),
  },
  emptyProgressTrack: {
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  emptyProgressFill: {
    height: '100%',
    backgroundColor: colors.lime,
    borderRadius: moderateScale(4),
  },
  devPanel: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: moderateScale(20),
  },
  devLabel: {
    ...typography.caption,
    color: colors.textFaint,
    marginBottom: moderateScale(10),
  },
  squadCard: {
    backgroundColor: colors.bgCard,
    borderRadius: moderateScale(24),
    padding: moderateScale(26),
    marginBottom: moderateScale(28),
    borderWidth: 1,
    borderColor: colors.lime,
  },
  squadAvatarRow: {
    flexDirection: 'row',
    marginBottom: moderateScale(16),
  },
  squadAvatar: {
    fontSize: scaleFont(24),
    width: moderateScale(38),
    height: moderateScale(38),
    lineHeight: moderateScale(38),
    textAlign: 'center',
    backgroundColor: colors.bg,
    borderRadius: moderateScale(19),
    borderWidth: 2,
    borderColor: colors.bgCard,
    overflow: 'hidden',
  },
  squadAvatarOverlap: {
    marginLeft: -moderateScale(12),
  },
  squadTitle: {
    ...typography.h2,
    color: colors.white,
    marginBottom: moderateScale(8),
  },
  squadSub: {
    ...typography.body,
    color: colors.textMuted,
  },
  squadEmptyCard: {
    backgroundColor: colors.bgCard,
    borderRadius: moderateScale(24),
    padding: moderateScale(26),
    marginBottom: moderateScale(28),
    borderWidth: 1,
    borderColor: colors.border,
  },
  squadEmptyEmoji: { fontSize: scaleFont(28), marginBottom: moderateScale(14) },
  squadEmptyTitle: {
    ...typography.h2,
    color: colors.white,
    marginBottom: moderateScale(8),
  },
  squadEmptySub: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: moderateScale(20),
  },
  squadCreateBtn: {
    backgroundColor: colors.lime,
    borderRadius: moderateScale(14),
    paddingVertical: moderateScale(13),
    alignItems: 'center',
  },
  squadCreateBtnText: {
    ...typography.bodyStrong,
    color: colors.bg,
    fontWeight: '800',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(8),
  },
  chip: {
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.limeMuted,
    borderColor: colors.lime,
  },
  chipText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  chipTextActive: {
    color: colors.lime,
    fontWeight: '700',
  },
});
