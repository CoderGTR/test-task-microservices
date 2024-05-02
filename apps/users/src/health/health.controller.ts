import {Controller, Get} from '@nestjs/common';
import {
    HealthCheckService,
    HttpHealthIndicator,
    HealthCheck,
    MongooseHealthIndicator,
    MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import {ConfigService} from "@nestjs/config";
import {Transport} from "@nestjs/microservices";
import {NotificationsHealthIndicator} from "./notifications-health-indicator";

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private configService: ConfigService,
        private db: MongooseHealthIndicator,
        private microservice: MicroserviceHealthIndicator,
        private notificationsHealthIndicator: NotificationsHealthIndicator,
    ) {}

    @Get()
    @HealthCheck()
    check() {
        const healthCheckUsersUrl = this.configService.get<string>('HEALTH_CHECK_USERS_URL');

        return this.health.check([
            () => this.http.pingCheck('users-service', healthCheckUsersUrl),
            () => this.db.pingCheck('mongodb'),
            () => this.microservice.pingCheck('rabbitmq', {
                transport: Transport.RMQ,
                options: {
                    urls: [this.configService.getOrThrow<string>('RABBITMQ_URI')],
                    queue: 'users',
                }
            }),
            async () => this.notificationsHealthIndicator.isHealthy('notifications'),
        ]);
    }
}