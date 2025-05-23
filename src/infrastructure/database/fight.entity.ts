import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { EventEntity } from './event.entity';
import { FighterEntity } from './fighter.entity';
import { FightParticipantEntity } from './fight-participant.entity';

@ObjectType()
@Entity('fights')
export class FightEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => EventEntity)
  @ManyToOne(() => EventEntity, (event) => event.fights, {
    onDelete: 'CASCADE', // when an event is deleted, delete all its fights
  })
  @JoinColumn({ name: 'eventId' })
  event: EventEntity;

  @Column()
  eventId: string;

  @Field(() => Number)
  @Column()
  roundCount: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  method?: string; // e.g. KO, Submission

  @Field({ nullable: true })
  @Column({ nullable: true })
  resultSummary?: string;

  @Field(() => FighterEntity, { nullable: true })
  @ManyToOne(() => FighterEntity)
  @JoinColumn({ name: 'winnerId' })
  winner?: FighterEntity;

  @Column({ nullable: true })
  winnerId?: string;

  @Field()
  @Column({ default: false })
  completed: boolean;

  @Field(() => [FightParticipantEntity], { nullable: true })
  @OneToMany(() => FightParticipantEntity, (fp) => fp.fight)
  participants: FightParticipantEntity[];
}
