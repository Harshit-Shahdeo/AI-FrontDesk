import { IsDateString, IsNotEmpty, IsString } from "class-validator";


export class UpdateAppointmentDto{
    @IsDateString()
    @IsNotEmpty()
    appointmentAt !:string;

    @IsNotEmpty()
    @IsString()
    customerId!: string;

    @IsNotEmpty()
    @IsString()
    serviceId!: string;

}
