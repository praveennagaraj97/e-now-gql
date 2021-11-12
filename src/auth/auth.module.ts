import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JWTContants } from 'src/constants/env.variables';
import { UserModule } from '../core/users/users.module';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get(JWTContants.JWT_SECRET),
        signOptions: { algorithm: 'HS256' },
      }),
    }),
  ],
  providers: [AuthResolver],
  exports: [JwtModule, UserModule],
})
export class AuthModule {}
