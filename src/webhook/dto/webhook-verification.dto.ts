import { IsNotEmpty, IsString } from "class-validator";

export class webhookVerificationDto{
    @IsString()
    @IsNotEmpty()
    mode!:string;

    @IsString()
    @IsNotEmpty()
    verifyToken !:string;

    @IsString()
    @IsNotEmpty()
    challenge !:string;

}