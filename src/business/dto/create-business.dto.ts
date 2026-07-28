import {IsNotEmpty, IsString} from 'class-validator';

export class CreateBusinessDto {
 @IsString()
 @IsNotEmpty()
 name !:string;  

 @IsString()
 @IsNotEmpty()
 ownerName !:string;

 @IsString()
 @IsNotEmpty()
 ownerPhone !:string;

    
}
