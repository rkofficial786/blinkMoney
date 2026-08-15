import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { SquadMember } from '../../types/squad';
import { formatInr } from '../../utils/format';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { moderateScale, scaleFont } from '../../utils/sizer';

type Props = {
  members: SquadMember[];
};

export function Leaderboard({ members }: Props) {
  const sorted = [...members].sort((a, b) => b.contribution - a.contribution);
  const maxContribution = Math.max(...members.map(m => m.contribution), 1);
  const you = members.find(m => m.isYou);
  const [nudgedId, setNudgedId] = useState<string | null>(null);

  const handleNudge = (member: SquadMember) => {
    if (member.isYou) return;
    setNudgedId(member.id);
    setTimeout(() => setNudgedId(current => (current === member.id ? null : current)), 1800);
  };

  return (
    <View style={styles.list}>
      {sorted.map((member, index) => (
        <Row
          key={member.id}
          member={member}
          rank={index + 1}
          pct={(member.contribution / maxContribution) * 100}
          nudged={nudgedId === member.id}
          isBehindYou={!!you && !member.isYou && member.contribution < you.contribution}
          onPress={() => handleNudge(member)}
        />
      ))}
    </View>
  );
}

function Row({
  member,
  rank,
  pct,
  nudged,
  isBehindYou,
  onPress,
}: {
  member: SquadMember;
  rank: number;
  pct: number;
  nudged: boolean;
  isBehindYou: boolean;
  onPress: () => void;
}) {
  const width = useSharedValue(0);

  React.useEffect(() => {
    width.value = withTiming(pct, { duration: 700, easing: Easing.out(Easing.cubic) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pct]);

  const barStyle = useAnimatedStyle(() => ({ width: `${width.value}%` }));

  return (
    <Pressable
      onPress={onPress}
      disabled={member.isYou}
      style={({ pressed }) => [styles.row, pressed && !member.isYou && styles.rowPressed]}
      accessibilityRole={member.isYou ? undefined : 'button'}
      accessibilityLabel={member.isYou ? undefined : `Nudge ${member.name}`}
    >
      <Text style={styles.rank}>{rank}</Text>
      <Text style={styles.avatar}>{member.avatarEmoji}</Text>
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{member.name}</Text>
          {member.isYou && (
            <View style={styles.youBadge}>
              <Text style={styles.youBadgeText}>YOU</Text>
            </View>
          )}
        </View>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, barStyle, member.isYou && styles.fillYou]} />
        </View>
      </View>
      <Text style={styles.amount}>{formatInr(member.contribution)}</Text>
      {nudged && (
        <View style={styles.nudgeToast}>
          <Text style={styles.nudgeToastText}>
            {isBehindYou ? 'Nudged 👋' : 'Cheered 🙌'}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: moderateScale(10),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: moderateScale(16),
    padding: moderateScale(12),
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowPressed: {
    opacity: 0.75,
  },
  rank: {
    ...typography.bodyStrong,
    color: colors.textFaint,
    width: moderateScale(18),
  },
  avatar: {
    fontSize: scaleFont(22),
    marginRight: moderateScale(10),
  },
  info: {
    flex: 1,
    marginRight: moderateScale(10),
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(6),
  },
  name: {
    ...typography.bodyStrong,
    color: colors.white,
  },
  youBadge: {
    backgroundColor: colors.limeMuted,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(6),
    paddingVertical: moderateScale(2),
    marginLeft: moderateScale(8),
  },
  youBadgeText: {
    ...typography.caption,
    fontSize: scaleFont(10),
    color: colors.lime,
    fontWeight: '700',
  },
  track: {
    height: moderateScale(6),
    borderRadius: moderateScale(4),
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: moderateScale(4),
    backgroundColor: colors.textMuted,
  },
  fillYou: {
    backgroundColor: colors.lime,
  },
  amount: {
    ...typography.bodyStrong,
    color: colors.white,
  },
  nudgeToast: {
    position: 'absolute',
    right: moderateScale(12),
    top: -moderateScale(10),
    backgroundColor: colors.lime,
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(3),
  },
  nudgeToastText: {
    ...typography.caption,
    fontSize: scaleFont(10),
    color: colors.bg,
    fontWeight: '700',
  },
});
