import { FighterEntity } from '../../infrastructure/database/fighter.entity';

export class RankingCalculator {
  static calculateScore(fighter: FighterEntity): number {
    const wins = fighter.wins ?? 0;
    const knockouts = fighter.knockouts ?? 0;
    const submissions = fighter.submissions ?? 0;
    const draws = fighter.draws ?? 0;

    return (wins * 3) + (knockouts * 4) + (submissions * 4) + draws;
  }

  static getWinPercentage(fighter: FighterEntity): number {
    const wins = fighter.wins ?? 0;
    const losses = fighter.losses ?? 0;
    const draws = fighter.draws ?? 0;
    const total = wins + losses + draws;
    return total === 0 ? 0 : wins / total;
  }
}
