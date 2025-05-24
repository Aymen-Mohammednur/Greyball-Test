import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { FighterModule } from './presentation/graphql/fighter/fighter.module';
import { FighterEntity } from './infrastructure/database/fighter.entity';
import { EventModule } from './presentation/graphql/event/event.module';
import { EventEntity } from './infrastructure/database/event.entity';
import { FightModule } from './presentation/graphql/fight/fight.module';
import { FightEntity } from './infrastructure/database/fight.entity';
import { FightParticipantEntity } from './infrastructure/database/fight-participant.entity';
import { SchedulerModule } from './presentation/graphql/ranking/ranking.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        TYPEORM_SYNC: Joi.boolean().default(false),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [FighterEntity, EventEntity, FightEntity, FightParticipantEntity],
        synchronize: configService.get<boolean>('TYPEORM_SYNC'),
        logging: false,
      }),
    }),
    FighterModule,
    EventModule,
    FightModule,
    SchedulerModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
