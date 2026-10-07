import { IsDateString, IsInt, IsPositive } from 'class-validator';

export class CreateRentalDto {
  @IsInt()
  @IsPositive()
  carId!: number;

  @IsInt()
  @IsPositive()
  customerId!: number;

  /** Formato 'YYYY-MM-DD', por ejemplo '2026-10-10' */
  @IsDateString({ strict: true })
  startDate!: string;

  @IsDateString({ strict: true })
  endDate!: string;
}
