import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from 'src/customer/dto/create-customer.dto';

@Injectable()
export class AppointmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
    businessId: string,
  ) {
    
    const business = await this.getBusiness(businessId);

    const customer = await this.getCustomer(createAppointmentDto.customerId, businessId )
    
    const service = await this.getService(createAppointmentDto.serviceId, businessId);
   

    const appointmentAt = new Date(createAppointmentDto.appointmentAt);

    const appointmentEndAt = new Date(
      appointmentAt.getTime() + service.duration * 60 * 1000,
    );

  const availability = await this.validateAppointmentTime(
  businessId,
  appointmentAt,
  appointmentEndAt,
    );
    if(!availability.available){
      throw new BadRequestException({
        message:'Requested time slot is unavialble.',
        nextAvailable:availability.nextAvailable,
      });
    }
   
    return this.prisma.appointment.create({
      data: {
        appointmentAt,
        appointmentEndAt,

        duration: service.duration,
        price: service.price,

        businessId,
        customerId: customer.id,
        serviceId: service.id,
      },
    });
  }

   private async validateAppointmentTime(
      businessId:string,
      appointmentAt:Date,
      appointmentEndAt:Date,
      appointmentId?: string,

    ):Promise<{
      available:boolean;
      start?:Date;
      nextAvailable?:Date;
    }>{
       const appointments = await this.prisma.appointment.findMany({
        where:{
          businessId,

          appointmentEndAt:{
            gte:appointmentAt,
          },
          NOT:appointmentId
          ?{
            id:appointmentId,
          }
          :undefined,
        },
        orderBy:{
          appointmentAt:'asc',
        }
       });

       let candidateStart = appointmentAt;

       for(const appointment of appointments){
         const candidateEnd = new Date(candidateStart.getTime() + 
        (appointmentEndAt.getTime() - appointmentAt.getTime()),
      );
      if(candidateEnd <= appointment.appointmentAt){
          return{
            available:true,
            nextAvailable:candidateStart,
          };
        }

      if(candidateStart < appointment.appointmentEndAt &&
        candidateEnd > appointment.appointmentAt
      ){

        candidateStart = appointment.appointmentEndAt;
        
        
      }
       }

       if(candidateStart.getTime() === appointmentAt.getTime()){
        return{
          available:true,
          start:candidateStart,
        };
       }

       return{
        available:false,
        nextAvailable:candidateStart,
       };
    }

private async getBusiness(businessId: string) {
  const business = await this.prisma.business.findUnique({
    where: {
      id: businessId,
    },
  });

  if (!business) {
    throw new NotFoundException('Business not found');
  }

  return business;
}

private async getCustomer(customerId:string, businessId:string, ){
    const customer = await this.prisma.customer.findFirst({
      where: {
        id: customerId,
        businessId,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
}

private async getService(serviceId:string, businessId:string){
  const service = await this.prisma.service.findFirst({
      where: {
        id: serviceId,
        businessId,
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (!service.isActive) {
      throw new BadRequestException('Service is inactive');
    }

    return service;
}

  findAll(businessId: string) {
    return this.prisma.appointment.findMany({
      where: {
        businessId,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}