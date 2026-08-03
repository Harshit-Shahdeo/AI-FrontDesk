import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BusinessHoursDayDto } from './business-hours-day.dto';

export class CreateBusinessHoursDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusinessHoursDayDto)
  hours!: BusinessHoursDayDto[];
}