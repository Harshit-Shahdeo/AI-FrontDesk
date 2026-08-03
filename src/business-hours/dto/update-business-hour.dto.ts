import { PartialType } from '@nestjs/mapped-types';
import { CreateBusinessHoursDto} from './create-business-hour.dto';
import { BusinessHoursDayDto } from './business-hours-day.dto';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBusinessHourDto extends CreateBusinessHoursDto {}

