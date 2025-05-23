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
} from '../../../application/fighter/fighter.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([FighterEntity])],
  providers: [
    FighterResolver,
    CreateFighter,
    GetAllFighters,
    GetFighterById,
    DeleteFighter,
    UpdateFighter,
  ],
})
export class FighterModule {}
