import { IsDateString, IsNotEmpty, IsString } from "class-validator";


export class CreateAppointmentDto {
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
