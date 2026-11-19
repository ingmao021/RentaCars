import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRentalDto } from './dto/create-rental.dto.js';
import { UpdateRentalDto } from './dto/update-rental.dto.js';
import { Rental } from './entities/rental.entity.js';
import { User } from '../users/entities/user.entity.js';
import { Car } from '../cars/entities/car.entity.js';

@Injectable()
export class RentalsService {
  constructor(
    @InjectRepository(Rental)
    private readonly rentalRepository: Repository<Rental>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}

  private validateDates(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Las fechas no son válidas');
    }
    if (end <= start) {
      throw new BadRequestException(
        'endDate debe ser posterior a startDate',
      );
    }
  }

  async create(body: CreateRentalDto) {
    const user = await this.userRepository.findOneBy({ id: body.userId });
    if (!user) {
      throw new NotFoundException(`Usuario con id ${body.userId} no encontrado`);
    }

    const car = await this.carRepository.findOneBy({ id: body.carId });
    if (!car) {
      throw new NotFoundException(`Carro con id ${body.carId} no encontrado`);
    }
    if (!car.isAvailable) {
      throw new BadRequestException(
        `El carro con id ${body.carId} no está disponible`,
      );
    }

    this.validateDates(body.startDate, body.endDate);

    const { userId, carId, ...data } = body;
    const rental = await this.rentalRepository.save({
      ...data,
      user: { id: userId },
      car: { id: carId },
    });

    await this.carRepository.update(car.id, { isAvailable: false });

    return this.findOne(rental.id);
  }

  async findAll() {
    return await this.rentalRepository.find({
      relations: { user: { profile: true }, car: true },
    });
  }

  async findOne(id: number) {
    const rental = await this.rentalRepository.findOne({
      where: { id },
      relations: { user: { profile: true }, car: true },
    });
    if (!rental) {
      throw new NotFoundException(`Alquiler con id ${id} no encontrado`);
    }
    return rental;
  }

  async update(id: number, body: UpdateRentalDto) {
    const rental = await this.findOne(id);
    this.validateDates(
      body.startDate ?? rental.startDate.toISOString(),
      body.endDate ?? rental.endDate.toISOString(),
    );

    if (body.isActive !== undefined && body.isActive !== rental.isActive) {
      if (body.isActive === true) {
        const currentCar = await this.carRepository.findOneBy({
          id: rental.car.id,
        });
        if (currentCar && !currentCar.isAvailable) {
          throw new BadRequestException(
            `El carro con id ${rental.car.id} no está disponible`,
          );
        }
        await this.carRepository.update(rental.car.id, { isAvailable: false });
      } else {
        await this.carRepository.update(rental.car.id, { isAvailable: true });
      }
    }

    const updatedRental = this.rentalRepository.merge(rental, body);
    await this.rentalRepository.save(updatedRental);
    return this.findOne(id);
  }

  async remove(id: number) {
    const rental = await this.findOne(id);
    await this.rentalRepository.remove(rental);
    if (rental.isActive) {
      await this.carRepository.update(rental.car.id, { isAvailable: true });
    }
    return { message: `Alquiler con id ${id} eliminado` };
  }
}
