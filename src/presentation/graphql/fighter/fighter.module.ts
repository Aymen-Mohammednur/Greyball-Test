import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FighterEntity } from '../../../infrastructure/database/fighter.entity';
import { FighterResolver } from './fighter.resolver';
import {
  CreateFighter,
  GetAllFighters,
  GetFighterById,
  DeleteFighter,
  UpdateFighter,
  GetFighterProfileUseCase,
} from '../../../application/fighter/fighter.usecase';
import { GetTopRankedFightersUseCase } from 'src/application/ranking/ranking.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([FighterEntity])],
  providers: [
    FighterResolver,
    CreateFighter,
    GetAllFighters,
    GetFighterById,
    DeleteFighter,
    UpdateFighter,
    GetTopRankedFightersUseCase,
    GetFighterProfileUseCase
  ],
})
export class FighterModule {}
