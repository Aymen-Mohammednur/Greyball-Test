// src/infrastructure/scheduler/ranking-scheduler.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UpdateRankingsUseCase } from 'src/application/ranking/ranking.usecase';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FighterEntity } from '../database/fighter.entity';

@Injectable()
export class RankingSchedulerService {
  private readonly logger = new Logger(RankingSchedulerService.name);

  constructor(
    private readonly updateRankingsUseCase: UpdateRankingsUseCase,
    @InjectRepository(FighterEntity)
    private readonly fighterRepo: Repository<FighterEntity>,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.log('Running hourly ranking update...');

    // Get distinct weight classes
    const weightClasses = await this.fighterRepo
      .createQueryBuilder('f')
      .select('DISTINCT f.weightClass', 'weightClass')
      .getRawMany();

    for (const { weightClass } of weightClasses) {
      await this.updateRankingsUseCase.executeForWeightClass(weightClass);
    }

    this.logger.log('Ranking update complete for all weight classes.');
  }
}
