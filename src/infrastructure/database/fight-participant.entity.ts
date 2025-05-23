import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FightEntity } from './fight.entity';
import { FighterEntity } from './fighter.entity';

@ObjectType()
@Entity('fight_participants')
export class FightParticipantEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => FightEntity)
  @ManyToOne(() => FightEntity, (fight) => fight.participants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'fightId' })
  fight: FightEntity;

  @Column()
  fightId: string;

  @Field(() => FighterEntity)
  @ManyToOne(() => FighterEntity, { eager: true })
  @JoinColumn({ name: 'fighterId' })
  fighter: FighterEntity;

  @Column()
  fighterId: string;

  @Field()
  @Column()
  corner: 'red' | 'blue';

  @Field({ nullable: true })
  @Column({ nullable: true })
  isWinner?: boolean;
}
