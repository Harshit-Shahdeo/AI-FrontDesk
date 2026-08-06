import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { whatsAppMessageParser } from './parser/whatsapp-message.parser';
import { webhookVerificationParser } from './parser/webhook-verification.parser';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService,
            whatsAppMessageParser,
            webhookVerificationParser,
  ],
})
export class WebhookModule {}
