import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BusinessHoursService } from './business-hours.service';
import { CreateBusinessHoursDto } from './dto/create-business-hour.dto';
import { UpdateBusinessHourDto } from './dto/update-business-hour.dto';

@Controller('businesses/:businessId/hours')
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.businessHoursService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBusinessHourDto: UpdateBusinessHourDto) {
    return this.businessHoursService.update(+id, updateBusinessHourDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.businessHoursService.remove(+id);
  }
}
