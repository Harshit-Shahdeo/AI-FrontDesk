import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Business } from 'src/business/entities/business.entity';

@Controller('businesses/:businessId/customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@Param('businessId') businessId:string, @Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto, businessId);
  }

  @Get()
  findAll(@Param('businessId') businessId:string) {
    return this.customerService.findAll(businessId);
  }

  @Get(':customerId')
  findOne(@Param('customerId') customerId: string, @Param('businessId') businessId:string) {
    return this.customerService.findOne(customerId, businessId);
  }

  @Put(':customerId')
  update(@Param('customerId') customerId: string, @Body() updateCustomerDto: UpdateCustomerDto, @Param('businessId')businessId:string) {
    return this.customerService.update(customerId, updateCustomerDto, businessId);
  }

  @Delete(':customerId')
  remove(@Param('customerId') customerId: string,@Param('businessId') bsuinessId:string) {
    return this.customerService.remove(customerId, bsuinessId);
  }
}
