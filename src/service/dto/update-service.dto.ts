import {IsNotEmpty, IsString, IsNumber, IsOptional} from 'class-validator';

export class UpdateServiceDto {
@IsNotEmpty()
@IsString()
name !:string;

@IsOptional()
@IsString()
description ?: string;

@IsNotEmpty()
@IsNumber()
duration !: number;

@IsNotEmpty()
@IsNumber()
price !: number;




}
