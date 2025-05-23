import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@Entity('events')
@ObjectType()
export class EventEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  @Column()
  @Field(() => String)
  location: string;

  @Column({ type: 'timestamp' })
  @Field(() => Date)
  eventDate: Date;
}
