import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from '../prisma/prisma.service';
import { timeStamp } from 'console';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma:PrismaService){}


  async create(createCustomerDto: CreateCustomerDto) {
    const business = await this.prisma.business.findUnique({
      where:{
        id:createCustomerDto.businessId,
      },
    });
    if(!business){
      throw new NotFoundException('Business not found')
    }
    return this.prisma.customer.create({
      data: createCustomerDto,
    });
  }

  findAll() {
    return `This action returns all customer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
