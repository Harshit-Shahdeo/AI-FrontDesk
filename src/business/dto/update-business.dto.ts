import { PartialType } from '@nestjs/mapped-types';
import { CreateBusinessDto } from './create-business.dto';
import {IsNotEmpty, IsString} from 'class-validator';

export class UpdateBusinessDto extends PartialType(CreateBusinessDto) {
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
