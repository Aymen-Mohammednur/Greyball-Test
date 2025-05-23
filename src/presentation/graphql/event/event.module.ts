import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from '../../../infrastructure/database/event.entity';
import {
  CreateEventUseCase,
  GetAllEventsUseCase,
  GetEventByIdUseCase,
  UpdateEventUseCase,
  DeleteEventUseCase,
} from '../../../application/event/event.usecase';
import { EventResolver } from './event.resolver';
import { FightEntity } from 'src/infrastructure/database/fight.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity, FightEntity])],
  providers: [
    EventResolver,
    CreateEventUseCase,
    GetAllEventsUseCase,
    GetEventByIdUseCase,
    UpdateEventUseCase,
    DeleteEventUseCase,
  ],
})
export class EventModule {}
