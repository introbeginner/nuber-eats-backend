import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsModule } from './restaurants/restaurants.module';

import * as Joi from"joi";
import { Restaurant } from './restaurants/entities/restaurant.entity';
import { UesrsModule } from './uesrs/uesrs.module';
import { User } from './uesrs/entities/user.entity';
import { CommonModule } from './common/common.module';

@Module({
  imports: [GraphQLModule.forRoot({
    autoSchemaFile: true,
  }),  
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: process.env.NODE_ENV === "dev" ? ".env.dev" : '.env.test',
    ignoreEnvFile : process.env.NODE_ENV === 'prod',
    validationSchema: Joi.object({
      NODE_ENV:Joi.string().valid('dev','prod').required(),
      DB_USERNAME:Joi.string().required(),
      DB_PASSWORD:Joi.string().required(),
      DB_HOST:Joi.string().required(),
      DB_NAME:Joi.string().required(),
    })
  }),
  TypeOrmModule.forRoot({"type": "postgres",
  'host':process.env.DB_HOST,
  'port':+process.env.DB_PORT,
  'username':process.env.DB_USERNAME,
  'password':process.env.DB_PASSWORD,
  'database':process.env.DB_NAME,
  "synchronize": process.env.NODE_ENV !== 'prod',
  "logging": true,
  entities: [User, Restaurant]}),
  UesrsModule,
  RestaurantsModule,
  CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}