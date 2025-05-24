import { ObjectType, Field, ID } from '@nestjs/graphql';
import { FighterEntity } from 'src/infrastructure/database/fighter.entity';

@ObjectType()
export class FightSummaryOutput {
  @Field(() => ID)
  fightId: string;

  @Field()
  result: 'win' | 'loss' | 'draw';

  @Field()
  method: string;

  @Field()
  isWinner: boolean;

  @Field()
  fightDate: Date;

  @Field(() => FighterEntity)
  opponent: FighterEntity;
}

@ObjectType()
export class FighterProfileOutput {
  @Field(() => ID)
  id: string;

  @Field()
  nickname: string;

  @Field()
  weightClass: string;

  @Field()
  winPercentage: number;

  @Field()
  wins: number;

  @Field()
  losses: number;

  @Field()
  draws: number;

  @Field({ nullable: true })
  rank?: number;

  @Field({ nullable: true })
  rankingPoints?: number;

  @Field(() => [FightSummaryOutput])
  fightHistory: FightSummaryOutput[];
}
