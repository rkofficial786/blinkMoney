export type MonthlyPoint = {
  label: string;
  amount: number;
};

export type WrappedData = {
  userName: string;
  periodLabel: string;
  streakDays: number;
  longestStreak: number;
  totalSaved: number;
  growthPercent: number;
  monthly: MonthlyPoint[];
  milestoneAmount: number;
  milestoneLabel: string;
  percentileRank: number;
  referralsInvited: number;
  personality: string;
  personalityEmoji: string;
};

export type WrappedScenario = 'eligible' | 'newUser' | 'zeroStreak' | 'error';
