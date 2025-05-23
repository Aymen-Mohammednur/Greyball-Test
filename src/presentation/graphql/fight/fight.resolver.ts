// src/presentation/graphql/fight/fight.resolver.ts
import {
  Resolver,
  Mutation,
  Args,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';

import { FightEntity } from '../../../infrastructure/database/fight.entity';
import { CreateFightInput, RecordFightResultInput, UpdateFightInput } from './fight.input';
import {
  CreateFightUseCase,
  GetAllFightsUseCase,
  GetFightByIdUseCase,
  UpdateFightUseCase,
  DeleteFightUseCase,
  RecordFightResultUseCase,
} from '../../../application/fight/fight.usecase';
import { FightParticipantEntity } from 'src/infrastructure/database/fight-participant.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Resolver(() => FightEntity)
export class FightResolver {
  constructor(
    private readonly createFightUseCase: CreateFightUseCase,
    private readonly getAllFightsUseCase: GetAllFightsUseCase,
    private readonly getFightByIdUseCase: GetFightByIdUseCase,
    private readonly updateFightUseCase: UpdateFightUseCase,
    private readonly deleteFightUseCase: DeleteFightUseCase,
    private readonly recordFightResultUseCase: RecordFightResultUseCase,

    @InjectRepository(FightParticipantEntity)
    private readonly participantRepo: Repository<FightParticipantEntity>,
  ) {}

  @Mutation(() => FightEntity)
  async createFight(
    @Args('input') input: CreateFightInput,
  ): Promise<FightEntity> {
    return this.createFightUseCase.execute(input);
  }

  @Query(() => [FightEntity])
  async getAllFights() {
    return this.getAllFightsUseCase.execute();
  }

  @Query(() => FightEntity)
  async getFightById(@Args('id') id: string) {
    return this.getFightByIdUseCase.execute(id);
  }

  @Mutation(() => FightEntity)
  async updateFight(
    @Args('id') id: string,
    @Args('input') input: UpdateFightInput,
  ) {
    return this.updateFightUseCase.execute(id, input);
  }

  @Mutation(() => Boolean)
  async deleteFight(@Args('id') id: string) {
    return this.deleteFightUseCase.execute(id);
  }

  @Mutation(() => FightEntity)
  async recordFightResult(
    @Args('input') input: RecordFightResultInput,
  ): Promise<FightEntity> {
    return this.recordFightResultUseCase.execute(input);
  }

  @ResolveField(() => [FightParticipantEntity])
  async participants(
    @Parent() fight: FightEntity,
  ): Promise<FightParticipantEntity[]> {
    return this.participantRepo.find({
      where: { fightId: fight.id },
      relations: ['fighter'],
    });
  }
}
