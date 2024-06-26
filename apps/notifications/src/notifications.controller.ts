import {Controller, Get, UsePipes, ValidationPipe} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import {Ctx, EventPattern, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import {NotifyEmailDto} from "./dto/notify-email.dto";

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UsePipes(new ValidationPipe())
  @EventPattern('notify_email')
  async notifyEmail(@Payload() data: NotifyEmailDto){
    await this.notificationsService.notifyEmail(data);
  }

  @MessagePattern('health_check')
  healthCheck(@Payload() data: any, @Ctx() context: RmqContext): string {
    return 'pong';
  }
}
