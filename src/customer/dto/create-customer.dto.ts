import {IsNotEmpty, IsString, IsOptional} from 'class-validator';


export class CreateCustomerDto {
@IsNotEmpty()
@IsString()
name !:string;

@IsNotEmpty()
@IsString()
phone !:string;

@IsString()
@IsOptional()
email ?:string

@IsString()
@IsNotEmpty()
businessId !:string
}