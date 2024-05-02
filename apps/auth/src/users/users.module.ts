import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {DatabaseModule, NOTIFICATIONS_SERVICE} from '@app/common';
import { UserDocument, UserSchema } from "@app/common";
import { UsersRepository } from "./users.repository";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {ConfigService} from "@nestjs/config";

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([{ name: UserDocument.name, schema: UserSchema }]),
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
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
