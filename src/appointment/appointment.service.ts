import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AppointmentStatus } from '@prisma/client';
import { BusinessHour } from 'src/business-hours/entities/business-hour.entity';

@Injectable()
export class AppointmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
    businessId: string,
  ) {
    await this.getBusiness(businessId);

    const customer = await this.getCustomer(
      createAppointmentDto.customerId,
      businessId,
    );

    const service = await this.getService(
      createAppointmentDto.serviceId,
      businessId,
    );

    const requestedStart = new Date(createAppointmentDto.appointmentAt);

    const requestedEnd = this.calculateMinutes(requestedStart, service);

    await this.validateBusinessAvailability(businessId, requestedStart, requestedEnd);

    const slot = await this.findNextAvailableSlot(
      businessId,
      requestedStart,
      requestedEnd,
    );

    if (!slot.exactMatch) {
      throw new BadRequestException({
        message: 'Requested time slot is unavailable.',
        nextAvailable: slot.scheduledStart,
      });
    }

    return this.prisma.appointment.create({
      data: {
        appointmentAt: slot.scheduledStart,
        appointmentEndAt: slot.scheduledEnd,

        duration: service.duration,
        price: service.price,

        businessId,
        customerId: customer.id,
        serviceId: service.id,
      },
    });
  }

  private async findNextAvailableSlot(
    businessId: string,
    requestedStart: Date,
    requestedEnd: Date,
    appointmentId?: string,
  ): Promise<{
    exactMatch: boolean;
    scheduledStart: Date;
    scheduledEnd: Date;
  }> {
    const appointments = await this.prisma.appointment.findMany({
      where: {
        businessId,

        appointmentEndAt: {
          gte: requestedStart,
        },

        NOT: appointmentId
          ? {
              id: appointmentId,
            }
          : undefined,
      },

      orderBy: {
        appointmentAt: 'asc',
      },
    });

    const durationMs =
      requestedEnd.getTime() - requestedStart.getTime();

    let currentStart = requestedStart;

    for (const appointment of appointments) {
      const currentEnd = new Date(
        currentStart.getTime() + durationMs,
      );

      // Found a free gap before this appointment
      if (currentEnd <= appointment.appointmentAt) {
        return {
          exactMatch:
            currentStart.getTime() === requestedStart.getTime(),
          scheduledStart: currentStart,
          scheduledEnd: currentEnd,
        };
      }

      // Overlapping appointment, move candidate start forward
      if (
        currentStart < appointment.appointmentEndAt &&
        currentEnd > appointment.appointmentAt
      ) {
        currentStart = appointment.appointmentEndAt;
      }
    }

    return {
      exactMatch:
        currentStart.getTime() === requestedStart.getTime(),
      scheduledStart: currentStart,
      scheduledEnd: new Date(currentStart.getTime() + durationMs),
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

  private async getCustomer(
    customerId: string,
    businessId: string,
  ) {
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

  private async getService(
    serviceId: string,
    businessId: string,
  ) {
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

  private calculateMinutes(requestedStart:Date, service:{duration:number}) :Date{
    return new Date(requestedStart.getTime() + service.duration * 60 * 1000 );
  };

  private async validateBusinessAvailability(businessId : string, requestedStart:Date, requestedEnd:Date){
     const jsDay = requestedStart.getDay();

     const dayOfWeek = jsDay === 0?7:jsDay;

     const businessHour = await this.prisma.businessHours.findFirst({
      where:{
        businessId,
        dayOfWeek,
      },
      include:{
        breakPeriods:true,
      }
     });
     
if(!businessHour || !businessHour.isOpen){
  throw new BadRequestException('Business is closed on the requested date ');
};

const startMinutes = requestedStart.getHours() * 60 + requestedStart.getMinutes();
const endMinutes = requestedEnd.getHours() * 60 + requestedEnd.getMinutes();
  

const outsideBusinessHours = (startMinutes < businessHour.opensAtMinutes  || 
                             endMinutes > businessHour.closesAtMinutes);


if(outsideBusinessHours){
  throw new BadRequestException(`Please book appointments within business hours that is from ${this.formatMinutes(businessHour.opensAtMinutes)} to ${this.formatMinutes(businessHour.closesAtMinutes)}`)
}


    for(const breakPeriod of businessHour.breakPeriods){
      const overlap = startMinutes < breakPeriod.endsAtMinutes && endMinutes > breakPeriod.startsAtMinutes;

      if(overlap){
        throw new BadRequestException(`Your current request is under business's break periods,
            break lasts from ${this.formatMinutes(breakPeriod.startsAtMinutes)} to
             ${this.formatMinutes(breakPeriod.endsAtMinutes)}`);
      }
    }
   

  }

  private formatMinutes(minutes:number){
    const hour = Math.floor(minutes/60);
    const mins = minutes%60;

    return `${hour.toString().padStart(2, '0')}:${mins.toString().padStart(2,'0')}`;
  }
  

  findAll(businessId: string) {
    return this.prisma.appointment.findMany({
      where: {
        businessId,
      },
    });
  }

  async findOne(id: string, businessId:string) {
    const appointment = await  this.prisma.appointment.findFirst({
      where:{
        id,
        businessId,
      }
    });
    if(!appointment){
      throw new NotFoundException('Appointment not found')
    }

    return appointment;
  }

  async update(id: string, businessId:string, updateAppointmentDto: UpdateAppointmentDto) {

   // Do not remove the variable, keep it even if umused 
   const appointment = await this.findOne(id,businessId );

   if(appointment.status !== AppointmentStatus.SCHEDULED){
    throw new BadRequestException('Only scheduled appointmnets can be updated')
   }
   
   const customer = await this.getCustomer(updateAppointmentDto.customerId, businessId);
   
   const service = await this.getService(updateAppointmentDto.serviceId, businessId);

   const requestedStart = new Date(updateAppointmentDto.appointmentAt);

   const requestedEnd = new Date(requestedStart.getTime() + service.duration * 60 * 1000,);

   await this.validateBusinessAvailability(businessId, requestedStart, requestedEnd);

   const slot = await this.findNextAvailableSlot(businessId, requestedStart, requestedEnd, id);

   if(!slot.exactMatch){
    throw new BadRequestException({
      message:'Requested Time is Unavailable',
      nextAvailable:slot.scheduledStart,
    })
   }

   return this.prisma.appointment.update({
    where:{
      id,
    },
    data:{ appointmentAt : slot.scheduledStart,
           appointmentEndAt:slot.scheduledEnd,

           duration: service.duration,
           price:    service.price,

              
           customerId: customer.id,
           serviceId: service.id,

    }
   })

  }

  async remove(id: string, businessId:string) {
   const appointment =  await this.findOne(id, businessId);
  
   switch (appointment.status) {
  case AppointmentStatus.CANCELLED:
    throw new BadRequestException(
      'Appointment is already cancelled.',
    );

  case AppointmentStatus.COMPLETED:
    throw new BadRequestException(
      'Completed appointments cannot be cancelled.',
    );

  case AppointmentStatus.NO_SHOW:
    throw new BadRequestException(
      'No-show appointments cannot be cancelled.',
    );
}
   
    return this.prisma.appointment.update({
      where:{
        id,
      },
      data:{
        status:AppointmentStatus.CANCELLED,
      }
    })
  }
}