import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import {LoggerModule, NOTIFICATIONS_SERVICE} from "@app/common";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import * as Joi from "joi";
import {LocalStrategy} from "./strategies/local.strategy";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {HealthModule} from "./health/health.module";

@Module({
  imports: [
    UsersModule,
    LoggerModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION')}s`
        }
      }),
      inject: [ConfigService],
  }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
        HTTP_PORT: Joi.number().required(),
        TCP_PORT: Joi.number().required(),
        NOTIFICATIONS_HOST: Joi.string().required(),
        NOTIFICATIONS_PORT: Joi.number().required(),
      })
    }),
    ClientsModule.registerAsync([
      {
        name: NOTIFICATIONS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
            queue: 'notifications',
          }
        }),
        inject: [ConfigService],
      }
    ]),
    HealthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
