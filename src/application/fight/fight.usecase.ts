// src/application/use-cases/fight/create-fight.use-case.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateFightInput,
  RecordFightResultInput,
  UpdateFightInput,
} from '../../presentation/graphql/fight/fight.input';
import { FightEntity } from '../../infrastructure/database/fight.entity';
import { FightParticipantEntity } from '../../infrastructure/database/fight-participant.entity';
import { removeUndefinedKeys } from '../../shared/utils';
import { FighterEntity } from 'src/infrastructure/database/fighter.entity';
import { UpdateRankingsUseCase } from '../ranking/ranking.usecase';

@Injectable()
export class CreateFightUseCase {
  constructor(
    @InjectRepository(FightEntity)
    private readonly fightRepo: Repository<FightEntity>,

    @InjectRepository(FightParticipantEntity)
    private readonly participantRepo: Repository<FightParticipantEntity>,
  ) {}

  async execute(input: CreateFightInput): Promise<FightEntity> {
    const fight = this.fightRepo.create({
      eventId: input.eventId,
      roundCount: input.roundCount,
    });

    const savedFight = await this.fightRepo.save(fight);

    const redParticipant = this.participantRepo.create({
      fightId: savedFight.id,
      fighterId: input.redFighterId,
      corner: 'red',
    });

    const blueParticipant = this.participantRepo.create({
      fightId: savedFight.id,
      fighterId: input.blueFighterId,
      corner: 'blue',
    });

    await this.participantRepo.save([redParticipant, blueParticipant]);

    // Re-fetch the fight with its participants
    const fullFight = await this.fightRepo.findOne({
      where: { id: savedFight.id },
      relations: ['participants', 'participants.fighter'],
    });

    if (!fullFight) {
      throw new NotFoundException(
        `Fight with ID ${savedFight.id} not found after creation`,
      );
    }

    return fullFight;
  }
}

@Injectable()
export class GetAllFightsUseCase {
  constructor(
    @InjectRepository(FightEntity)
    private readonly fightRepo: Repository<FightEntity>,
  ) {}

  async execute(): Promise<FightEntity[]> {
    return this.fightRepo.find({
      relations: ['event'],
    });
  }
}

@Injectable()
export class GetFightByIdUseCase {
  constructor(
    @InjectRepository(FightEntity)
    private readonly fightRepo: Repository<FightEntity>,
  ) {}

  async execute(id: string): Promise<FightEntity> {
    const fight = await this.fightRepo.findOne({
      where: { id },
      relations: ['event'],
    });

    if (!fight) {
      throw new NotFoundException(`Fight with ID ${id} not found`);
    }

    return fight;
  }
}

@Injectable()
export class UpdateFightUseCase {
  constructor(
    @InjectRepository(FightEntity)
    private readonly fightRepo: Repository<FightEntity>,
  ) {}

  async execute(id: string, input: UpdateFightInput): Promise<FightEntity> {
    const fight = await this.fightRepo.findOneBy({ id });

    if (!fight) {
      throw new NotFoundException(`Fight with ID ${id} not found`);
    }

    const updates = removeUndefinedKeys(input);
    Object.assign(fight, updates);
    return this.fightRepo.save(fight);
  }
}

@Injectable()
export class DeleteFightUseCase {
  constructor(
    @InjectRepository(FightEntity)
    private readonly fightRepo: Repository<FightEntity>,
  ) {}

  async execute(id: string): Promise<boolean> {
    const result = await this.fightRepo.delete(id);
    return !!result.affected && result.affected > 0;
  }
}

@Injectable()
export class RecordFightResultUseCase {
  constructor(
    @InjectRepository(FightEntity)
    private readonly fightRepo: Repository<FightEntity>,

    @InjectRepository(FightParticipantEntity)
    private readonly participantRepo: Repository<FightParticipantEntity>,

    @InjectRepository(FighterEntity)
    private readonly fighterRepo: Repository<FighterEntity>,

    private readonly updateRankingsUseCase: UpdateRankingsUseCase,
  ) {}

  async execute(input: RecordFightResultInput): Promise<FightEntity> {
    const fight = await this.fightRepo.findOneBy({ id: input.fightId });

    if (!fight) {
      throw new NotFoundException(`Fight with ID ${input.fightId} not found`);
    }

    const fighter = await this.fighterRepo.findOneBy({ id: input.winnerId });

    if (!fighter) {
      throw new NotFoundException(
        `Fighter with ID ${input.winnerId} not found`,
      );
    }

    // Prevent duplicate submissions
    if (fight.completed) {
      throw new BadRequestException(`Fight result has already been recorded`);
    }

    const participants = await this.participantRepo.find({
      where: { fightId: fight.id },
    });

    if (participants.length !== 2) {
      throw new BadRequestException('Fight must have exactly 2 participants');
    }

    // Assign winner flags to participants
    if (input.winnerId) {
      for (const participant of participants) {
        participant.isWinner = participant.fighterId === input.winnerId;
      }
      fight.winnerId = input.winnerId;
    } else {
      for (const participant of participants) {
        participant.isWinner = undefined; // Draw
      }
      fight.winnerId = undefined;
    }

    fight.completed = true;
    fight.method = input.method;
    fight.resultSummary = input.resultSummary ?? undefined;

    await this.participantRepo.save(participants);
    await this.fightRepo.save(fight);

    // Now update stats of both fighters
    const [fighterA, fighterB] = await Promise.all(
      participants.map((p) => this.fighterRepo.findOneBy({ id: p.fighterId })),
    );

    if (!fighterA || !fighterB) {
      throw new NotFoundException('One or both fighters not found');
    }

    // Reset only what’s relevant for this fight
    if (input.winnerId) {
      const winner = [fighterA, fighterB].find((f) => f.id === input.winnerId)!;
      const loser = [fighterA, fighterB].find((f) => f.id !== input.winnerId)!;

      winner.wins = (winner.wins ?? 0) + 1;
      loser.losses = (loser.losses ?? 0) + 1;

      if (input.method.toLowerCase() === 'ko') {
        winner.knockouts = (winner.knockouts ?? 0) + 1;
      }

      if (input.method.toLowerCase() === 'decision') {
        winner.decisions = (winner.decisions ?? 0) + 1;
      }

      if (input.method.toLowerCase() === 'submission') {
        winner.submissions = (winner.submissions ?? 0) + 1;
      }
    } else {
      fighterA.draws = (fighterA.draws ?? 0) + 1;
      fighterB.draws = (fighterB.draws ?? 0) + 1;
    }

    const now = new Date();
    fighterA.lastFightDate = now;
    fighterB.lastFightDate = now;

    await this.fighterRepo.save([fighterA, fighterB]);

    const updatedFight = await this.fightRepo.findOne({
      where: { id: fight.id },
      relations: ['participants', 'participants.fighter'],
    });

    // Update rankings asynchronously
    setTimeout(() => {
      this.updateRankingsUseCase.executeForWeightClass(fighterA.weightClass);
    }, 0);

    if (!updatedFight) {
      throw new NotFoundException(
        `Fight with ID ${fight.id} not found after updating result`,
      );
    }

    return updatedFight;
  }
}
