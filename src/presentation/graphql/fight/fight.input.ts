import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsInt,
  Min,
  IsUUID,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateFightInput {
  @Field()
  @IsUUID()
  eventId: string;

  @Field()
  @IsUUID()
  redFighterId: string;

  @Field()
  @IsUUID()
  blueFighterId: string;

  @Field()
  @IsInt()
  @Min(1)
  roundCount: number;
}

@InputType()
export class UpdateFightInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  roundCount?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  method?: string; // e.g. KO, Submission

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  resultSummary?: string;

  @Field({ nullable: true })
  @IsOptional()
  completed?: boolean;
}

@InputType()
export class RecordFightResultInput {
  @Field()
  @IsUUID()
  fightId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  winnerId?: string; // nullable for draw

  @Field()
  @IsString()
  method: string; // KO, Decision, Submission, etc.

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  resultSummary?: string;
}
