import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class ServiceService {
constructor(private readonly prisma: PrismaService){}

  async create(createServiceDto: CreateServiceDto, businessId:string) {
    const business = await this.prisma.business.findUnique({
      where:{
        id:businessId,
      },
    });

    if(!business){
      throw new NotFoundException('Business Not Found');
    }
    return this.prisma.service.create({
      data:{
        ...createServiceDto,
        businessId
      }
    })
  }

  findAll(businessId:string) {
    return this.prisma.service.findMany({
      where:{
        businessId,
      }
    })
  }

  async findOne(businessId:string, serviceId:string) {
   const service = await this.prisma.service.findFirst({
    where:{
      id:serviceId,
      businessId
    }
   });

   if(!service){
     throw new NotFoundException('service not found')
   }

   return service

  }

  async update(businessId:string,serviceId:string, updateServiceDto: UpdateServiceDto) {
   await this.findOne(businessId, serviceId);


    return await this.prisma.service.update({
     where:{
      id:serviceId,
     },
     data:{
      ...updateServiceDto,
     }
    })

  }

  async remove(businessId:string, serviceId:string) {
   await this.findOne(businessId, serviceId);

    return this.prisma.service.delete({
      where:{
        id:serviceId,
      }
    })
  }
}
