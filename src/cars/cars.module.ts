import { Module } from '@nestjs/common';
import { CarsService } from './cars.service.js';
import { CarsController } from './cars.controller.js';
import { Car } from './entities/car.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Car])],
  controllers: [CarsController],
  providers: [CarsService],
})
export class CarsModule {}
