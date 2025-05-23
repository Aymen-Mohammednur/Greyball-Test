import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { FighterEntity } from '../../../infrastructure/database/fighter.entity';
import {
  CreateFighter,
  GetAllFighters,
  GetFighterById,
  DeleteFighter,
  UpdateFighter,
} from '../../../application/fighter/fighter.usecase';
import { CreateFighterInput, UpdateFighterInput } from './fighter.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { GetTopRankedFightersUseCase } from 'src/application/ranking/ranking.usecase';

@Resolver(() => FighterEntity)
export class FighterResolver {
  constructor(
    private readonly createFighterUseCase: CreateFighter,
    private readonly getAllFightersUseCase: GetAllFighters,
    private readonly getFighterByIdUseCase: GetFighterById,
    private readonly updateFighterUseCase: UpdateFighter,
    private readonly deleteFighterUseCase: DeleteFighter,
    private readonly getTopRankedFightersUseCase: GetTopRankedFightersUseCase,
  ) {}

  @Query(() => [FighterEntity])
  async getAllFighters() {
    return this.getAllFightersUseCase.execute();
  }

  @Query(() => FighterEntity, { nullable: true })
  async getFighterById(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
  ) {
    return this.getFighterByIdUseCase.execute(id);
  }

  @Mutation(() => FighterEntity)
  async createFighter(@Args('input') input: CreateFighterInput) {
    return this.createFighterUseCase.execute(input);
  }

  @Mutation(() => FighterEntity)
  async updateFighter(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
    @Args('input') input: UpdateFighterInput,
  ) {
    return this.updateFighterUseCase.execute(id, input);
  }

  @Mutation(() => Boolean)
  async deleteFighter(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
  ) {
    return this.deleteFighterUseCase.execute(id);
  }

  @Query(() => [FighterEntity])
  async getTopRankedFighters(
    @Args('weightClass') weightClass: string,
    @Args('limit', { type: () => Number, nullable: true }) limit = 10,
  ) {
    return this.getTopRankedFightersUseCase.execute(weightClass, limit);
  }
}
