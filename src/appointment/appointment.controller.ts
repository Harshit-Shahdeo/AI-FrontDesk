import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('businesses/:businessId/appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  create( @Param('businessId') businessId:string,@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto, businessId);
  }

  @Get()
  findAll(@Param('businessId')businessId:string) {
    return this.appointmentService.findAll(businessId);
  }

  @Get(':id')
  findOne(@Param('id',) id: string, @Param('businessId') businessId:string ) {
    return this.appointmentService.findOne(id, businessId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Param('businessId') businessId:string ,@Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentService.update(id,businessId,  updateAppointmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Param('businessId') businessId:string) {
    return this.appointmentService.remove(id, businessId);
  }
}
