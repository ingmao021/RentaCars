import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCarDto } from './dto/create-car.dto.js';
import { UpdateCarDto } from './dto/update-car.dto.js';
import { Car } from './entities/car.entity.js';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car) private carRepository: Repository<Car>,
  ) {}

  async create(body: CreateCarDto) {
    await this.validatePlate(body.plate);
    try {
      const newCar = await this.carRepository.save(body);
      return {
        message: 'Carro creado exitosamente',
        data: newCar,
      };
    } catch {
      throw new BadRequestException('Error al crear el carro');
    }
  }

  async findAll() {
    const cars = await this.carRepository.find({
      relations: { rentals: true },
    });
    return {
      data: cars,
      count: cars.length,
    };
  }

  async findOne(id: number) {
    const car = await this.carRepository.findOne({
      where: { id },
      relations: { rentals: { user: { profile: true } } },
    });
    if (!car) {
      throw new NotFoundException(`Carro con ID ${id} no existe`);
    }
    return car;
  }

  async update(id: number, changes: UpdateCarDto) {
    const car = await this.findOne(id);
    if (changes.plate) {
      await this.validatePlate(changes.plate, id);
    }
    try {
      const updatedCar = this.carRepository.merge(car, changes);
      const savedCar = await this.carRepository.save(updatedCar);
      return {
        message: 'Carro actualizado exitosamente',
        data: savedCar,
      };
    } catch {
      throw new BadRequestException('Error al actualizar el carro');
    }
  }

  async remove(id: number) {
    const car = await this.findOne(id);
    try {
      await this.carRepository.delete(car.id);
      return {
        message: 'Carro eliminado exitosamente',
        data: car,
      };
    } catch {
      throw new BadRequestException('Error al eliminar el carro');
    }
  }

  private async validatePlate(plate: string, currentId?: number) {
    const found = await this.carRepository.findOne({ where: { plate } });
    if (found && found.id !== currentId) {
      throw new BadRequestException(`Ya existe un carro con la placa ${plate}`);
    }
  }
}
