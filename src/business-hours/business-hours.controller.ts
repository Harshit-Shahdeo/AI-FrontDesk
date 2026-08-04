import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { BusinessHoursService } from './business-hours.service';
import { CreateBusinessHoursDto } from './dto/create-business-hour.dto';
import { UpdateBusinessHourDto } from './dto/update-business-hour.dto';

@Controller('businesses/:businessId/business-hours')
export class BusinessHoursController {
  constructor(private readonly businessHoursService: BusinessHoursService) {}

  @Post()
  create( @Body() createBusinessHourDto: CreateBusinessHoursDto,@Param('businessId') businessId:string,) {
    return this.businessHoursService.create(createBusinessHourDto, businessId);
  }

  @Get()
  findAll( @Param('businessId') businessId:string) {
    return this.businessHoursService.findAll(businessId);
  }


  @Put()
  update(@Param('businessId') businessId: string, @Body() updateBusinessHourDto: UpdateBusinessHourDto) {
    return this.businessHoursService.update(businessId, updateBusinessHourDto);
  }


}
