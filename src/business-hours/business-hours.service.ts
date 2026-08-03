import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBusinessHoursDto } from './dto/create-business-hour.dto';
import { UpdateBusinessHourDto } from './dto/update-business-hour.dto';
import { PrismaService } from '../prisma/prisma.service';
import { BusinessHoursDayDto } from './dto/business-hours-day.dto';

@Injectable()
export class BusinessHoursService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createBusinessHourDto: CreateBusinessHoursDto,
    businessId: string,
  ) {
    await this.getBusiness(businessId);
    await this.duplicateBusinessHoursValidator(businessId);

    this.validateDuplicateDays(createBusinessHourDto);

    for (const hour of createBusinessHourDto.hours) {
      this.validateBusinessHour(hour);
    }

    return this.prisma.$transaction(
      createBusinessHourDto.hours.map((hour) =>
        this.prisma.businessHours.create({
          data: {
            businessId,
            dayOfWeek: hour.dayOfWeek,
            isOpen: hour.isOpen,
            opensAtMinutes: hour.opensAtMinutes,
            closesAtMinutes: hour.closesAtMinutes,

            breakPeriods: {
              create: hour.breakPeriods.map((breakPeriod) => ({
                startsAtMinutes: breakPeriod.startsAtMinutes,
                endsAtMinutes: breakPeriod.endsAtMinutes,
              })),
            },
          },
        }),
      ),
    );
  }

  private validateDuplicateDays(
    createBusinessHoursDto: CreateBusinessHoursDto,
  ) {
    const days = new Set<number>();

    for (const hour of createBusinessHoursDto.hours) {
      if (days.has(hour.dayOfWeek)) {
        throw new BadRequestException(
          `Duplicate dayOfWeek: ${hour.dayOfWeek}.`,
        );
      }

      days.add(hour.dayOfWeek);
    }
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

  // Ensures a business cannot create business hours twice.
  private async duplicateBusinessHoursValidator(businessId: string) {
    const existingHours = await this.prisma.businessHours.findFirst({
      where: {
        businessId,
      },
    });

    if (existingHours) {
      throw new BadRequestException(
        'Business hours already exist. Use update instead.',
      );
    }
  }

  private validateBusinessHour(hour: BusinessHoursDayDto) {
    if (!hour.isOpen) {
      return;
    }

    if (hour.opensAtMinutes < 0 || hour.opensAtMinutes > 1439) {
      throw new BadRequestException(
        'Opening time must be between 0 and 1439 minutes.',
      );
    }

    if (hour.closesAtMinutes < 0 || hour.closesAtMinutes > 1439) {
      throw new BadRequestException(
        'Closing time must be between 0 and 1439 minutes.',
      );
    }

    if (hour.opensAtMinutes >= hour.closesAtMinutes) {
      throw new BadRequestException(
        'Opening time must be before closing time.',
      );
    }

    this.validateBreakPeriods(hour);
  }

  private validateBreakPeriods(hour: BusinessHoursDayDto) {
    for (const breakPeriod of hour.breakPeriods) {
      if (
        breakPeriod.startsAtMinutes >= breakPeriod.endsAtMinutes
      ) {
        throw new BadRequestException(
          'Break must start before it ends.',
        );
      }

      if (
        breakPeriod.startsAtMinutes < hour.opensAtMinutes ||
        breakPeriod.endsAtMinutes > hour.closesAtMinutes
      ) {
        throw new BadRequestException(
          'Break must be within business hours.',
        );
      }
    }
  }

  async findAll(businessId:string) {
      await this.getBusiness(businessId);


    return this.prisma.businessHours.findMany({
      where:{businessId,

      },
      include:{
        breakPeriods:true,
      },
      orderBy:{
        dayOfWeek:'asc',
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} businessHour`;
  }

 async update(businessid:string, updateBusinessHourDto: UpdateBusinessHourDto) {

  for(const hour of updateBusinessHourDto.hours){
   const  existingHour = await this.findExistingHour(businessid, hour);

   if(existingHour){
   await this.updateExistingHour(existingHour.id, hour);
   }else{
    await this.createNewHour(businessid, hour);
   }
  }
    
  }
  private async findExistingHour(businessId:string, hour:BusinessHoursDayDto){
   return  await this.prisma.businessHours.findFirst({
      where:{
        businessId,
        dayOfWeek:hour.dayOfWeek
      }
    })

  }

  private async updateExistingHour(businessid:string,hour:BusinessHoursDayDto){

    await this.getBusiness(businessid);
    return await this.prisma.businessHours.update({
      where:{
        id:businessid,
      },
      data:{
        isOpen:hour.isOpen,
        opensAtMinutes: hour.opensAtMinutes,
        closesAtMinutes:hour.closesAtMinutes
      },
    })
  }

  private async createNewHour(businessId:string, hour:BusinessHoursDayDto){
    return this.prisma.businessHours.create({
          data: {
            businessId,
            dayOfWeek: hour.dayOfWeek,
            isOpen: hour.isOpen,
            opensAtMinutes: hour.opensAtMinutes,
            closesAtMinutes: hour.closesAtMinutes,

            breakPeriods: {
              create: hour.breakPeriods.map((breakPeriod) => ({
                startsAtMinutes: breakPeriod.startsAtMinutes,
                endsAtMinutes: breakPeriod.endsAtMinutes,
              })),
            },
          },
        });
  }

  private async replaceBreakPeriods(
  businessHoursId: string,
  hour: BusinessHoursDayDto,
) {
  await this.prisma.businessBreak.deleteMany({
    where: {
      businessHoursId,
    },
  });

  if (hour.breakPeriods.length === 0) {
    return;
  }

  await this.prisma.businessBreak.createMany({
    data: hour.breakPeriods.map((breakPeriod) => ({
      businessHoursId,
      startsAtMinutes: breakPeriod.startsAtMinutes,
      endsAtMinutes: breakPeriod.endsAtMinutes,
    })),
  });
}


  
}