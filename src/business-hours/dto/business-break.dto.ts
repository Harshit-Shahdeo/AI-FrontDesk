import { IsInt, Min } from 'class-validator';

export class BusinessBreakDto {
  @IsInt()
  @Min(0)
  startsAtMinutes !: number;

  @IsInt()
  @Min(0)
  endsAtMinutes !: number;
}