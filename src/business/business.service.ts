import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { PrismaService } from '../prisma/prisma.service';
  
@Injectable()
export class BusinessService{
  constructor(private readonly prisma:PrismaService){}

  async create(createBusinessDto:CreateBusinessDto){
    return this.prisma.business.create({
      data:createBusinessDto,
    });
  }
  
  async findAll(){
    return this.prisma.business.findMany();
  }

  async findOne(id:string){
    const business =  await this.prisma.business.findUnique({
      where:{
        id,
      },
    });

    if(!business){
      throw new NotFoundException('Business Not Found');
    }
    return business;
  }

  async update(id:string, updateBusinessDto : UpdateBusinessDto){
    await this.findOne(id);

     return this.prisma.business.update({
      where:{
        id,
      },
      
      data:updateBusinessDto,
    });

    
    
  }

  async remove(id:string){

    await this.findOne(id);
    
    return this.prisma.business.delete({
      where:{
        id,
      },
      
    });

  
  }
}

