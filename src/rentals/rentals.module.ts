import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalsService } from './rentals.service.js';
import { RentalsController } from './rentals.controller.js';
import { Rental } from './entities/rental.entity.js';
import { User } from '../users/entities/user.entity.js';
import { Car } from '../cars/entities/car.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Rental, User, Car])],
  controllers: [RentalsController],
  providers: [RentalsService],
})
export class RentalsModule {}
