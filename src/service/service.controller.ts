import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('businesses/:businessId/services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  create(@Param('businessId') businessId:string, @Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto, businessId);
  }

  @Get()
  findAll(@Param('businessId') businessId:string) {
    return this.serviceService.findAll(businessId);
  }

  @Get(':serviceId')
  findOne(@Param('businessId') businessId:string, @Param('serviceId') serviceId: string) {
    return this.serviceService.findOne(businessId, serviceId);
  }

  @Put(':serviceId')
  update(@Param('businessId') businessId:string,@Param('serviceId') serviceId: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(businessId, serviceId, updateServiceDto);
  }

  @Delete(':serviceId')
  remove( @Param('businessId') businessId:string, @Param('serviceId') serviceId: string) {
    return this.serviceService.remove(businessId, serviceId);
  }
}
