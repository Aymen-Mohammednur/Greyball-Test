import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FightEntity } from 'src/infrastructure/database/fight.entity';
import { FightParticipantEntity } from 'src/infrastructure/database/fight-participant.entity';
import {
  CreateFightUseCase,
  GetAllFightsUseCase,
  GetFightByIdUseCase,
  UpdateFightUseCase,
  DeleteFightUseCase,
  RecordFightResultUseCase
} from 'src/application/fight/fight.usecase';
import { FightResolver } from './fight.resolver';
import { FighterEntity } from 'src/infrastructure/database/fighter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FightEntity, FightParticipantEntity, FighterEntity])],
  providers: [
    FightResolver,
    CreateFightUseCase,
    GetAllFightsUseCase,
    GetFightByIdUseCase,
    UpdateFightUseCase,
    DeleteFightUseCase,
    RecordFightResultUseCase
  ],
})
export class FightModule {}
