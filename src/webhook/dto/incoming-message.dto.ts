import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class IncomingMessageDto{
    @IsNotEmpty()
    @IsString()
    phoneNumber !:string;
     
    @IsNotEmpty()
    @IsString()
    message !:string;
    
    @IsNotEmpty()
    @IsString()
    messageId !: string;
    
    @IsNotEmpty()
    @IsDate()
    timeStamp !: Date;
}