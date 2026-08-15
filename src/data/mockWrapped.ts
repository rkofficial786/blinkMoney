import { WrappedData, WrappedScenario } from '../types/wrapped';

const eligibleData: WrappedData = {
  userName: 'Raj',
  periodLabel: 'Jan – Aug 2026',
  streakDays: 47,
  longestStreak: 61,
  totalSaved: 184250,
  growthPercent: 22.4,
  monthly: [
    { label: 'Feb', amount: 12000 },
    { label: 'Mar', amount: 28000 },
    { label: 'Apr', amount: 41000 },
    { label: 'May', amount: 63000 },
    { label: 'Jun', amount: 98000 },
    { label: 'Jul', amount: 142000 },
    { label: 'Aug', amount: 184250 },
  ],
  milestoneAmount: 150000,
  milestoneLabel: 'Crossed ₹1.5L in savings',
  percentileRank: 12,
  referralsInvited: 0,
  personality: 'The Consistent Saver',
  personalityEmoji: '🧘',
};

const zeroStreakData: WrappedData = {
  ...eligibleData,
  streakDays: 0,
  longestStreak: 6,
  personality: 'The Slow Starter',
  personalityEmoji: '🌱',
};

export function fetchWrappedData(scenario: WrappedScenario): Promise<WrappedData> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (scenario === 'error') {
        reject(new Error('Could not reach BlinkMoney servers'));
        return;
      }
      if (scenario === 'zeroStreak') {
        resolve(zeroStreakData);
        return;
      }
      resolve(eligibleData);
    }, 1400);
  });
}
