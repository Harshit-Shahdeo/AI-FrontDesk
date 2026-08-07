import { Injectable } from '@nestjs/common';
import { IncomingMessageDto } from '../dto/incoming-message.dto';
import { MetaWebhookBody } from '../interface/webhook-interfaces';
@Injectable()
export class WhatsAppMessageParser {
  parse(body: MetaWebhookBody): IncomingMessageDto[] {
    const incomingMessages: IncomingMessageDto[] = [];

    for (const entry of body.entry) {
      for (const change of entry.changes) {
        if (!change.value.messages) {
          continue;
        }

        for (const message of change.value.messages) {
          if (message.type !== 'text' || !message.text) {
            continue;
          }

          incomingMessages.push({
            phoneNumber: message.from,
            message: message.text.body,
            messageId: message.id,
            timeStamp: new Date(
              Number(message.timestamp) * 1000,
            ),
          });
        }
      }
    }

    return incomingMessages;
  }
}