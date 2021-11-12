import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { graphqlUploadExpress } from 'graphql-upload';
import { join } from 'path';
import { AppModule } from './app.module';
import { AppConstants } from './constants/env.variables';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
  app.use(graphqlUploadExpress({ maxFiles: 10 }));
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  const corsWhitelist: string[] = app
    .get(ConfigService)
    .get(AppConstants.CORS_WHITELIST)
    ?.split(' ');

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || corsWhitelist.indexOf(origin) >= 0) {
        callback(null, origin);
        return origin;
      } else {
        callback(
          new HttpException(
            'Not Allowed by Cors',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      }
    },
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
