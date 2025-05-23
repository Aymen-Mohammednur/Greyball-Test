import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsOptional,
  IsString,
  IsInt,
  IsDateString,
  Min,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

@InputType()
export class CreateFighterInput {
  @Field()
  @IsString()
  @MaxLength(50)
  @IsNotEmpty({ message: 'firstName cannot be empty' })
  firstName: string;

  @Field()
  @IsString()
  @MaxLength(50)
  @IsNotEmpty({ message: 'lastName cannot be empty' })
  lastName: string;

  @Field()
  @IsString()
  @MaxLength(50)
  @IsNotEmpty({ message: 'nickname cannot be empty' })
  nickname?: string;

  @Field()
  @IsString()
  @MaxLength(50)
  @IsNotEmpty({ message: 'weightClass cannot be empty' })
  weightClass: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'gender cannot be empty' })
  gender: string;

  @Field()
  @IsDateString({}, { message: 'Date of birth must be in YYYY-MM-DD format' })
  @IsNotEmpty({ message: 'dateOfBirth cannot be empty' })
  dateOfBirth: string;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  heightCm: number;
}

@InputType()
export class UpdateFighterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nickname?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  weightClass?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nationality?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  gender?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString({}, { message: 'Date of birth must be in YYYY-MM-DD format' })
  dateOfBirth?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  heightCm?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  wins?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  losses?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  draws?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  knockouts?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  submissions?: number;
}
