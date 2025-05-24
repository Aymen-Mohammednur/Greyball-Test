import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FighterEntity } from '../../infrastructure/database/fighter.entity';
import { RankingCalculator } from '../../domain/services/ranking-calculator';

@Injectable()
export class UpdateRankingsUseCase {
  constructor(
    @InjectRepository(FighterEntity)
    private readonly fighterRepo: Repository<FighterEntity>,
  ) {}

  async executeForWeightClass(weightClass: string): Promise<void> {
    const fighters = await this.fighterRepo.find({ where: { weightClass } });

    // Compute score + win % for each fighter
    const ranked = fighters.map((fighter) => {
      const points = RankingCalculator.calculateScore(fighter);
      const winPercentage = RankingCalculator.getWinPercentage(fighter);
      return { fighter, points, winPercentage };
    });

    // Sort DESC by points, then win %, then nickname (as fallback)
    ranked.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.winPercentage !== a.winPercentage)
        return b.winPercentage - a.winPercentage;
      return a.fighter.nickname.localeCompare(b.fighter.nickname);
    });

    // Assign ranks and update fighters
    for (let i = 0; i < ranked.length; i++) {
      ranked[i].fighter.rank = i + 1;
      ranked[i].fighter.rankingPoints = ranked[i].points;
    }

    await this.fighterRepo.save(ranked.map((r) => r.fighter));
  }
}

@Injectable()
export class GetTopRankedFightersUseCase {
  constructor(
    @InjectRepository(FighterEntity)
    private readonly fighterRepo: Repository<FighterEntity>,
  ) {}

  async execute(weightClass: string, limit = 10): Promise<FighterEntity[]> {
    return this.fighterRepo.find({
      where: { weightClass },
      order: { rank: 'ASC' },
      take: limit,
    });
  }
}

@Injectable()
export class UpdateAllRankingsUseCase {
  constructor(
    @InjectRepository(FighterEntity)
    private readonly fighterRepo: Repository<FighterEntity>,
    private readonly updateRankingsUseCase: UpdateRankingsUseCase,
  ) {}

  async execute(): Promise<boolean> {
    const weightClasses = await this.fighterRepo
      .createQueryBuilder('f')
      .select('DISTINCT f.weightClass', 'weightClass')
      .getRawMany();

    for (const { weightClass } of weightClasses) {
      await this.updateRankingsUseCase.executeForWeightClass(weightClass);
    }

    return true;
  }
}
