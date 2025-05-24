import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { FightEntity } from './fight.entity';
import { FightParticipantEntity } from './fight-participant.entity';

@Entity('fighters')
@ObjectType()
export class FighterEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column()
  nickname: string;

  @Field()
  @Column()
  weightClass: string;

  @Field(() => Date)
  @Column({ type: 'timestamp' })
  dateOfBirth: Date;

  @Field(() => Int)
  @Column()
  heightCm: number;

  @Field(() => Int)
  @Column({ default: 0 })
  wins: number;

  @Field(() => Int)
  @Column({ default: 0 })
  losses: number;

  @Field(() => Int)
  @Column({ default: 0 })
  draws: number;

  @Field(() => Int)
  @Column({ default: 0 })
  knockouts: number;

  @Field(() => Int)
  @Column({ default: 0 })
  submissions: number;

  @Field(() => Int)
  @Column({ default: 0 })
  decisions: number;

  @Field(() => Number)
  @Column({ default: 0 })
  rankingPoints: number;

  @Field(() => Int)
  @Column({ default: 0 })
  rank: number;

  @Field({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  lastFightDate?: Date;

  @OneToMany(() => FightParticipantEntity, (participant) => participant.fighter)
  @Field(() => [FightParticipantEntity], { nullable: true })
  fightParticipants?: FightParticipantEntity[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  // not stored in the DB, but resolved dynamically
  @Field(() => Number, { nullable: true })
  winPercentage?: number;
}
