import { FighterEntity } from '../../infrastructure/database/fighter.entity';

export class RankingCalculator {
  static calculateScore(fighter: FighterEntity): number {
    const decisions = fighter.decisions ?? 0;
    const knockouts = fighter.knockouts ?? 0;
    const submissions = fighter.submissions ?? 0;
    const draws = fighter.draws ?? 0;

    const activity = RankingCalculator.getActivityMultiplier(fighter.lastFightDate);

    const baseScore = (decisions * 3) + (knockouts * 5) + (submissions * 5) + draws;
    return baseScore * activity;
  }

  static getActivityMultiplier(lastFightDate?: Date): number {
    if (!lastFightDate) return 0.5;

    const daysAgo =
      (Date.now() - new Date(lastFightDate).getTime()) / (1000 * 60 * 60 * 24);

    // scales from 0.5–1.2 depending on last fight date
    if (daysAgo < 30) return 1.2;
    if (daysAgo < 90) return 1.0;
    if (daysAgo < 180) return 0.8;
    return 0.5;
  }

  static getWinPercentage(fighter: FighterEntity): number {
    const wins = fighter.wins ?? 0;
    const losses = fighter.losses ?? 0;
    const draws = fighter.draws ?? 0;
    const total = wins + losses + draws;
    return total === 0 ? 0 : wins / total;
  }
}
