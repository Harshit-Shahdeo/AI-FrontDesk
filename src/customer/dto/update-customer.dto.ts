import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';
import {IsNotEmpty, IsString, IsOptional} from 'class-validator';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
    @IsNotEmpty()
    @IsString()
    name !:string;
    
    @IsNotEmpty()
    @IsString()
    phone !:string;
    
    @IsString()
    @IsOptional()
    email ?:string
    
    
}
