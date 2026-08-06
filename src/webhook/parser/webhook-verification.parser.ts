import { Injectable } from "@nestjs/common";
import { webhookVerificationDto } from "../dto/webhook-verification.dto";

@Injectable()
export class webhookVerificationParser{
    parse(query: any):webhookVerificationDto | null{
        const mode = query['hub.mode'];
        const verifyToken = query['hub.verify_token'];
        const challenge = query['hub.challenge'];
         
        if(!mode || !verifyToken || !challenge){
            return null;
        }

        return{
            mode,
            verifyToken,
            challenge,
        };

    }
}