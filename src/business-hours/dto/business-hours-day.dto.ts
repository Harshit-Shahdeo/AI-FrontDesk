import {
  IsArray,
  IsBoolean,
  IsInt,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BusinessBreakDto } from './business-break.dto';

export class BusinessHoursDayDto {
  @IsInt()
  @Min(1)
  @Max(7)
  dayOfWeek!: number;

  @IsBoolean()
  isOpen!: boolean;

  @IsInt()
  @Min(0)
  opensAtMinutes!: number;

  @IsInt()
  @Min(0)
  closesAtMinutes!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusinessBreakDto)
  breakPeriods!: BusinessBreakDto[];
}