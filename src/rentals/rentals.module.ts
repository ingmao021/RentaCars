import { Module } from '@nestjs/common';
import { RentalsService } from './rentals.service.js';
import { RentalsController } from './rentals.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rental } from './entities/rental.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Rental])],
  controllers: [RentalsController],
  providers: [RentalsService],
})
export class RentalsModule {}