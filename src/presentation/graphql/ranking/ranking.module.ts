import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  UpdateAllRankingsUseCase,
  UpdateRankingsUseCase,
} from 'src/application/ranking/ranking.usecase';
import { FighterEntity } from 'src/infrastructure/database/fighter.entity';
import { RankingSchedulerService } from 'src/infrastructure/scheduler/ranking-scheduler.service';
import { RankingResolver } from './ranking.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([FighterEntity])],
  providers: [
    RankingSchedulerService,
    UpdateRankingsUseCase,
    UpdateAllRankingsUseCase,
    RankingResolver,
  ],
})
export class SchedulerModule {}
