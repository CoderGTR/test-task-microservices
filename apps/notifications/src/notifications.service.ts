import { Injectable } from '@nestjs/common';
import {NotifyEmailDto} from "./dto/notify-email.dto";
import * as nodemailer from 'nodemailer';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class NotificationsService {
    constructor(private readonly configService: ConfigService) {
    }
    private readonly transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAUTH2',
            user: this.configService.get('SMTP_USER'),
            clientId: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
            clientSecret: this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
            refreshToken: this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
        }
    });

    async notifyEmail({email, text}: NotifyEmailDto) {
        const isMailingEnabled = this.configService.get<string>('EMAIL_NOTIFICATIONS_ENABLED') === 'true';

        if (isMailingEnabled) {
            await this.transporter.sendMail({
                from: this.configService.get('SMTP_USER'),
                to: email,
                subject: 'Test Notification',
                text,
            });
            console.log(text);
        } else {
            console.log('Mailing disabled in config. Sending mocked notification message:', text);
        }
    }
}
