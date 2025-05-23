import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { FightEntity } from './fight.entity';

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

  @Field(() => [FightEntity], { nullable: true })
  @OneToMany(() => FightEntity, (fight) => fight.event)
  fights: FightEntity[];
}
