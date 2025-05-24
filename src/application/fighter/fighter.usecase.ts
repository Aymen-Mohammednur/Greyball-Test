import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FighterEntity } from '../../infrastructure/database/fighter.entity';
import {
  CreateFighterInput,
  UpdateFighterInput,
} from 'src/presentation/graphql/fighter/fighter.input';
import { removeUndefinedKeys } from 'src/shared/utils';
import { RankingCalculator } from 'src/domain/services/ranking-calculator';
import {
  FighterProfileOutput,
  FightSummaryOutput,
} from 'src/presentation/graphql/fighter/fighter.output';

@Injectable()
export class CreateFighter {
  constructor(
    @InjectRepository(FighterEntity)
    private readonly fighterRepo: Repository<FighterEntity>,
  ) {}

  async execute(input: CreateFighterInput): Promise<FighterEntity> {
    const existing = await this.fighterRepo.findOne({
      where: { nickname: input.nickname },
    });

    if (existing) {
      throw new ConflictException(
        `Nickname '${input.nickname}' is already taken.`,
      );
    }

    const dateOfBirth = new Date(input.dateOfBirth);
    const now = new Date();
    if (dateOfBirth > now) {
      throw new BadRequestException('Date of birth cannot be in the future.');
    }

    const fighter = this.fighterRepo.create({
      ...input,
      dateOfBirth,
    });

    return this.fighterRepo.save(fighter);
  }
}

@Injectable()
export class GetAllFighters {
  constructor(
    @InjectRepository(FighterEntity)
    private readonly fighterRepo: Repository<FighterEntity>,
  ) {}

  async execute(): Promise<FighterEntity[]> {
    return this.fighterRepo.find();
  }
}

@Injectable()
export class GetFighterById {
  constructor(
    @InjectRepository(FighterEntity)
    private readonly fighterRepo: Repository<FighterEntity>,
  ) {}

  async execute(id: string): Promise<FighterEntity | null> {
    return this.fighterRepo.findOneBy({ id });
  }
}

@Injectable()
export class UpdateFighter {
  constructor(
    @InjectRepository(FighterEntity)
    private readonly fighterRepo: Repository<FighterEntity>,
  ) {}

  async execute(id: string, data: UpdateFighterInput): Promise<FighterEntity> {
    const fighter = await this.fighterRepo.findOneBy({ id });
    if (!fighter) {
      throw new NotFoundException(`Fighter with ID ${id} not found`);
    }

    // Validate dateOfBirth if provided
    if (data.dateOfBirth) {
      const dateOfBirth = new Date(data.dateOfBirth);
      const now = new Date();
      if (dateOfBirth > now) {
        throw new BadRequestException('Date of birth cannot be in the future.');
      }
    }

    const patch = {
      ...data,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
    };

    const input = removeUndefinedKeys(patch);

    // Check nickname uniqueness
    if (input.nickname && input.nickname !== fighter.nickname) {
      const existing = await this.fighterRepo.findOne({
        where: { nickname: input.nickname },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Nickname '${input.nickname}' is already taken.`,
        );
      }
    }

    Object.assign(fighter, input); // merge the new fields into the existing entity
    return this.fighterRepo.save(fighter);
  }
}

@Injectable()
export class DeleteFighter {
  constructor(
    @InjectRepository(FighterEntity)
    private readonly fighterRepo: Repository<FighterEntity>,
  ) {}

  async execute(id: string): Promise<boolean> {
    const result = await this.fighterRepo.delete(id);
    return !!result.affected && result.affected > 0;
  }
}

@Injectable()
export class GetFighterProfileUseCase {
  constructor(
    @InjectRepository(FighterEntity)
    private readonly fighterRepo: Repository<FighterEntity>,
  ) {}

  async execute(id: string): Promise<FighterProfileOutput> {
    const fighter = await this.fighterRepo.findOne({
      where: { id },
      relations: [
        'fightParticipants',
        'fightParticipants.fight',
        'fightParticipants.fight.participants',
      ],
    });

    if (!fighter)
      throw new NotFoundException(`Fighter with ID ${id} not found`);

    const winPercentage = RankingCalculator.getWinPercentage(fighter);

    const fightHistory: FightSummaryOutput[] = [];

    for (const myParticipant of fighter.fightParticipants ?? []) {
      const fight = myParticipant.fight;
      const opponentParticipant = fight.participants.find(
        (p) => p.fighter.id !== fighter.id,
      );

      if (!opponentParticipant) continue;

      fightHistory.push({
        fightId: fight.id,
        method: fight.method ?? 'N/A',
        result:
          myParticipant.isWinner === true
            ? 'win'
            : myParticipant.isWinner === false
              ? 'loss'
              : 'draw',
        isWinner: myParticipant.isWinner ?? false,
        fightDate: fight.event?.eventDate ?? new Date(),
        opponent: opponentParticipant.fighter,
      });
    }

    return {
      id: fighter.id,
      nickname: fighter.nickname,
      weightClass: fighter.weightClass,
      winPercentage,
      wins: fighter.wins ?? 0,
      losses: fighter.losses ?? 0,
      draws: fighter.draws ?? 0,
      rank: fighter.rank,
      rankingPoints: fighter.rankingPoints,
      fightHistory,
    };
  }
}
