export type SquadMember = {
  id: string;
  name: string;
  avatarEmoji: string;
  contribution: number;
  isYou: boolean;
};

export type SquadStatus = 'active' | 'completed' | 'expired';

export type SquadData = {
  challengeName: string;
  goalAmount: number;
  daysRemaining: number;
  totalDays: number;
  status: SquadStatus;
  members: SquadMember[];
  todayLogged: boolean;
  logAmount: number;
};

export type SquadScenario = 'active' | 'behind' | 'completed' | 'expired' | 'noSquad' | 'error';
