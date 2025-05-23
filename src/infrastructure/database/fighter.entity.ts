import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true })
  rankingPoints?: number;

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true })
  rank?: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
