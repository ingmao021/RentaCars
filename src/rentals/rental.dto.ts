import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';
import { RentalStatus } from './rental.model.js';

/** Body de POST /rentals */
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

/** Filtros opcionales de GET /rentals?carId=&customerId=&status= */
export class ListRentalsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  carId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  customerId?: number;

  @IsOptional()
  @IsEnum(RentalStatus)
  status?: RentalStatus;
}
