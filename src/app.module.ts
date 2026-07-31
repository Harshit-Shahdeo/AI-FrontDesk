import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BusinessModule } from './business/business.module';
import { CustomerService } from './customer/customer.service';
import { CustomerController } from './customer/customer.controller';
import { CustomerModule } from './customer/customer.module';
import { ServiceModule } from './service/service.module';
import { AppointmentModule } from './appointment/appointment.module';

@Module({
  imports: [PrismaModule, BusinessModule, CustomerModule, ServiceModule, AppointmentModule],
  controllers: [AppController, CustomerController],
  providers: [AppService, CustomerService],
})
export class AppModule {}
