import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { whatsAppMessageParser } from './parser/whatsapp-message.parser';
import { webhookVerificationParser } from './parser/webhook-verification.parser';

@Injectable()
export class WebhookService {
    constructor(private readonly Messageparser : whatsAppMessageParser,
                private readonly verificationParser :webhookVerificationParser,
    ){}

    receiveMessage(body:any){
        const incomingMessage = this.Messageparser.parse(body);

        if(!incomingMessage){
            return 'EVENT_RECEIVED';
        }

        console.log(incomingMessage);

        return 'EVENT_RECEIVED';
    }

    verifyWebhook(query:any){
        const verification = this.verificationParser.parse(query);
         
        if(!verification){
            throw new BadRequestException(
                'Invalid verification request'
            );
        }

        if(verification.mode === 'subscribe',
            verification.verifyToken === process.env.WHATSAPP_VERIFY_TOKEN
        ){
            return verification.challenge;
        }

        throw new ForbiddenException(
            'Invalid verification token',
        );

    }

    
}
