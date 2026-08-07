import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { WhatsAppMessageParser } from './parser/whatsapp-message.parser';
import { webhookVerificationParser } from './parser/webhook-verification.parser';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService,
            WhatsAppMessageParser,
            webhookVerificationParser,
  ],
})
export class WebhookModule {}
