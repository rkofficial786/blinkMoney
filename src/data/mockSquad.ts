import { SquadData, SquadScenario } from '../types/squad';

const activeData: SquadData = {
  challengeName: 'Save ₹10,000 Together',
  goalAmount: 10000,
  daysRemaining: 3,
  totalDays: 7,
  status: 'active',
  todayLogged: false,
  logAmount: 250,
  members: [
    { id: 'you', name: 'You', avatarEmoji: '🧑', contribution: 3200, isYou: true },
    { id: 'priya', name: 'Priya', avatarEmoji: '👩', contribution: 2800, isYou: false },
    { id: 'arjun', name: 'Arjun', avatarEmoji: '🧔', contribution: 2200, isYou: false },
    { id: 'meera', name: 'Meera', avatarEmoji: '👧', contribution: 1600, isYou: false },
  ],
};

const behindData: SquadData = {
  challengeName: 'Save ₹15,000 Together',
  goalAmount: 15000,
  daysRemaining: 2,
  totalDays: 7,
  status: 'active',
  todayLogged: false,
  logAmount: 250,
  members: [
    { id: 'priya', name: 'Priya', avatarEmoji: '👩', contribution: 4200, isYou: false },
    { id: 'arjun', name: 'Arjun', avatarEmoji: '🧔', contribution: 3600, isYou: false },
    { id: 'meera', name: 'Meera', avatarEmoji: '👧', contribution: 2900, isYou: false },
    { id: 'you', name: 'You', avatarEmoji: '🧑', contribution: 800, isYou: true },
  ],
};

const completedData: SquadData = {
  challengeName: 'Save ₹10,000 Together',
  goalAmount: 10000,
  daysRemaining: 0,
  totalDays: 7,
  status: 'completed',
  todayLogged: true,
  logAmount: 250,
  members: [
    { id: 'you', name: 'You', avatarEmoji: '🧑', contribution: 3500, isYou: true },
    { id: 'priya', name: 'Priya', avatarEmoji: '👩', contribution: 3200, isYou: false },
    { id: 'arjun', name: 'Arjun', avatarEmoji: '🧔', contribution: 2900, isYou: false },
    { id: 'meera', name: 'Meera', avatarEmoji: '👧', contribution: 2400, isYou: false },
  ],
};

const expiredData: SquadData = {
  challengeName: 'Save ₹20,000 Together',
  goalAmount: 20000,
  daysRemaining: 0,
  totalDays: 7,
  status: 'expired',
  todayLogged: true,
  logAmount: 250,
  members: [
    { id: 'priya', name: 'Priya', avatarEmoji: '👩', contribution: 3200, isYou: false },
    { id: 'arjun', name: 'Arjun', avatarEmoji: '🧔', contribution: 2800, isYou: false },
    { id: 'meera', name: 'Meera', avatarEmoji: '👧', contribution: 1900, isYou: false },
    { id: 'you', name: 'You', avatarEmoji: '🧑', contribution: 1000, isYou: true },
  ],
};

export function fetchSquadData(scenario: SquadScenario): Promise<SquadData> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      switch (scenario) {
        case 'error':
          reject(new Error('Could not reach BlinkMoney servers'));
          return;
        case 'behind':
          resolve(behindData);
          return;
        case 'completed':
          resolve(completedData);
          return;
        case 'expired':
          resolve(expiredData);
          return;
        default:
          resolve(activeData);
      }
    }, 1200);
  });
}
