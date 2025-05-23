import {
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

    const fighter = this.fighterRepo.create({
      ...input,
      dateOfBirth: new Date(input.dateOfBirth),
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
