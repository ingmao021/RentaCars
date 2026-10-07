import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';
import { RentalStatus } from '../../../domain/rental-status.enum.js';

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
