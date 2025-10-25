import { Achievement } from '@prisma/client';

export type AchievementWithProgress = Achievement & {
  isUnlocked: boolean;
  progress: number;
  currentValue: number;
};
