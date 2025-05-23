import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EventEntity } from '../../../infrastructure/database/entities/event.entity';
import {
  CreateEventUseCase,
  GetAllEventsUseCase,
  GetEventByIdUseCase,
  UpdateEventUseCase,
  DeleteEventUseCase,
} from '../../../application/event/event.usecase';
import {
  CreateEventInput,
  UpdateEventInput,
} from 'src/presentation/graphql/event/event.input';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver(() => EventEntity)
export class EventResolver {
  constructor(
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly getAllEventsUseCase: GetAllEventsUseCase,
    private readonly getEventByIdUseCase: GetEventByIdUseCase,
    private readonly updateEventUseCase: UpdateEventUseCase,
    private readonly deleteEventUseCase: DeleteEventUseCase,
  ) {}

  @Query(() => [EventEntity])
  async getAllEvents() {
    return this.getAllEventsUseCase.execute();
  }

  @Query(() => EventEntity, { nullable: true })
  async getEventById(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
  ) {
    return this.getEventByIdUseCase.execute(id);
  }

  @Mutation(() => EventEntity)
  async createEvent(@Args('input') input: CreateEventInput) {
    return this.createEventUseCase.execute(input);
  }

  @Mutation(() => EventEntity)
  async updateEvent(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
    @Args('input') input: UpdateEventInput,
  ) {
    return this.updateEventUseCase.execute(id, input);
  }

  @Mutation(() => Boolean)
  async deleteEvent(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
  ) {
    return this.deleteEventUseCase.execute(id);
  }
}
