import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import {ConfigService} from "@nestjs/config";
import {catchError, firstValueFrom, throwError, timeout, TimeoutError} from "rxjs";

@Injectable()
export class NotificationsHealthIndicator extends HealthIndicator {
    private client: ClientProxy;

    constructor(private configService: ConfigService) {
        super();
        this.client = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls:[this.configService.getOrThrow<string>('RABBITMQ_URI')],
                queue: 'notifications',
            },
        });
    }

    async isHealthy(key: string): Promise<HealthIndicatorResult> {
        const timeoutPeriod = 5000; // 5000 ms timeout

        try {
            const response = await firstValueFrom(
                this.client.send<string, string>('health_check', 'ping').pipe(
                    timeout(timeoutPeriod),
                    catchError(err => {
                        if (err instanceof TimeoutError) {
                            return throwError(() => new Error('Request timed out'));
                        }
                        return throwError(() => err);
                    })
                )
            );

            const isHealthy = response === 'pong';
            return this.getStatus(key, isHealthy, {
                message: isHealthy ? 'Service is up' : 'No response or service is down',
            });
        } catch (error) {
            return this.getStatus(key, false, {
                message: `Health check failed: ${error.message}`,
            });
        }
    }
}
