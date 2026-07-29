import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from '../prisma/prisma.service';
import { timeStamp } from 'console';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma:PrismaService){}


  async create(createCustomerDto: CreateCustomerDto,
    businessId:string
  ) {
    const business = await this.prisma.business.findUnique({
      where:{
        id:businessId,
      },
    });
    if(!business){
      throw new NotFoundException('Business not found')
    }
    return this.prisma.customer.create({
      data:{
        ...createCustomerDto,
        businessId
      }
    });
  }

  async findAll(businessId:string) {
    return this.prisma.customer.findMany({
      where:{
        businessId,
      }
    });
  }

  async findOne(customerId:string, businessId:string) {
    const customer = await this.prisma.customer.findFirst({
      where:{
        id:customerId,
        businessId,
      },
    });

    if(!customer){
      throw new NotFoundException('Customer Not Found')
    }
    return customer;
  }

  async update(customerId: string, updateCustomerDto: UpdateCustomerDto, businessId:string) {
    await this.findOne(customerId, businessId);

    return this.prisma.customer.update({
      where:{
        id: customerId,
      
      },
      data:updateCustomerDto
    });
  }

  async remove(customerId:string, businessId:string) {
    await this.findOne(customerId, businessId);

    return this.prisma.customer.delete({
      where:{
        id:customerId
      }
    })



  }
}
