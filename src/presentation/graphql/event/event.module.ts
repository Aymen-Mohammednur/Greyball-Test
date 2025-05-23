import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from '../../../infrastructure/database/entities/event.entity';
import {
  CreateEventUseCase,
  GetAllEventsUseCase,
  GetEventByIdUseCase,
  UpdateEventUseCase,
  DeleteEventUseCase,
} from '../../../application/event/event.usecase';
import { EventResolver } from './event.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity])],
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
