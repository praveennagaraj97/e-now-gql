import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from 'express';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { DatabaseConstants } from './constants/env.variables';
import { ProductModule } from './core/product/product.module';
import { SlidersModule } from './core/sliders/sliders.module';
import { SharedModule } from './shared/shared.module';

const applicationModules = [AuthModule, SlidersModule, ProductModule];

@Module({
  imports: [
    ...applicationModules,
    SharedModule,
    ConfigModule.forRoot({ envFilePath: ['.env'], isGlobal: true }),
    GraphQLModule.forRootAsync({
      inject: [],
      useFactory: () => ({
        context: ({ req }: { req: Request }) => ({ req, res: req.res }),
        autoSchemaFile: 'src/graphql/schema.gql',
        path: '__graphql',
        debug: false,
        cors: { credentials: true, origin: true },
        uploads: {
          maxFileSize: 20000000,
          maxFiles: 5,
        },
        installSubscriptionHandlers: true,
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        database: configService.get(DatabaseConstants.DB_NAME),
        port: configService.get(DatabaseConstants.DB_PORT),
        username: configService.get(DatabaseConstants.DB_USERNAME),
        password: configService.get(DatabaseConstants.DB_PASSWORD),
        type: 'postgres',
        host: configService.get(DatabaseConstants.DB_HOST),
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: true,
        retryDelay: 4000,
        retryAttempts: 5,
        keepConnectionAlive: false,
      }),
    }),
  ],
})
export class AppModule {}
