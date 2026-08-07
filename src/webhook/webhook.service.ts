import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { WhatsAppMessageParser } from './parser/whatsapp-message.parser';
import { webhookVerificationParser } from './parser/webhook-verification.parser';
import { Logger } from '@nestjs/common';


@Injectable()
export class WebhookService {
    constructor(private readonly messageparser : WhatsAppMessageParser,
                private readonly verificationParser :webhookVerificationParser,    ){}
  
    private readonly logger = new Logger(WebhookService.name);
    receiveMessage(body:any){
        const incomingMessage = this.messageparser.parse(body);

        if(incomingMessage.length == 0){
            return 'EVENT_RECEIVED';
        }
     for(const message of incomingMessage){

        this.logger.log(message);
     }

        return 'EVENT_RECEIVED';
    }

    verifyWebhook(query:any){
        const verification = this.verificationParser.parse(query);
         
        if(!verification){
            throw new BadRequestException(
                'Invalid verification request'
            );
        }

        if(verification.mode === 'subscribe' &&
            verification.verifyToken === process.env.WHATSAPP_VERIFY_TOKEN
        ){
            return verification.challenge;
        }

        throw new ForbiddenException(
            'Invalid verification token',
        );

    }

    
}
