import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';

@InputType()
export class CreateEventInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  location: string;

  @Field()
  @IsDateString({}, { message: 'eventDate must be in YYYY-MM-DD format' })
  eventDate: string;
}

@InputType()
export class UpdateEventInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  location?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  eventDate?: string;
}
