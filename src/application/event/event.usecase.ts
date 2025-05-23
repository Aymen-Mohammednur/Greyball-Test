import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from '../../infrastructure/database/entities/event.entity';
import {
  CreateEventInput,
  UpdateEventInput,
} from 'src/presentation/graphql/event/event.input';
import { removeUndefinedKeys } from 'src/shared/utils';

@Injectable()
export class CreateEventUseCase {
  constructor(
    @InjectRepository(EventEntity) private repo: Repository<EventEntity>,
  ) {}

  async execute(input: CreateEventInput): Promise<EventEntity> {
    const event = this.repo.create({
      ...input,
      eventDate: new Date(input.eventDate),
    });
    return this.repo.save(event);
  }
}

@Injectable()
export class GetAllEventsUseCase {
  constructor(
    @InjectRepository(EventEntity) private repo: Repository<EventEntity>,
  ) {}

  async execute(): Promise<EventEntity[]> {
    return this.repo.find();
  }
}

@Injectable()
export class GetEventByIdUseCase {
  constructor(
    @InjectRepository(EventEntity) private repo: Repository<EventEntity>,
  ) {}

  async execute(id: string): Promise<EventEntity | null> {
    return this.repo.findOne({ where: { id } });
  }
}

@Injectable()
export class UpdateEventUseCase {
  constructor(
    @InjectRepository(EventEntity) private repo: Repository<EventEntity>,
  ) {}

  async execute(id: string, data: UpdateEventInput): Promise<EventEntity> {
    const event = await this.repo.findOneBy({ id });
    if (!event) throw new NotFoundException(`Event with ID ${id} not found`);

    const patch = {
      ...data,
      dateOfBirth: data.eventDate ? new Date(data.eventDate) : undefined,
    };

    const input = removeUndefinedKeys(patch);

    Object.assign(event, input);
    return this.repo.save(event);
  }
}

@Injectable()
export class DeleteEventUseCase {
  constructor(
    @InjectRepository(EventEntity) private repo: Repository<EventEntity>,
  ) {}

  async execute(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return !!result.affected && result.affected > 0;
  }
}
