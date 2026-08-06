import { Injectable } from "@nestjs/common";
import { IncomingMessageDto } from "../dto/incoming-message.dto";

@Injectable()

export class whatsAppMessageParser{
    parse(body: any): IncomingMessageDto | null{
        const message = body.entry[0].changes[0].value.messages[0];
       
     if(!message){
        return null;
     }

     if(message.type !=='text'){
        return null;
     }

        return{
            phoneNumber:message.from,
            message : message.text.body,
            messageId: message.id,
            timeStamp: new Date(
                Number(message.timeStamp) * 1000,
            ),
        };
    }
}