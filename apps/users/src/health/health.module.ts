import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import {ConfigModule} from "@nestjs/config";
import {NotificationsHealthIndicator} from "./notifications-health-indicator";

@Module({
    imports: [TerminusModule, HttpModule, ConfigModule],
    controllers: [HealthController],
    providers: [NotificationsHealthIndicator]
})
export class HealthModule {}