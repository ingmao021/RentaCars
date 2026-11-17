import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRentalDto } from './dto/create-rental.dto.js';
import { UpdateRentalDto } from './dto/update-rental.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Rental } from './entities/rental.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class RentalsService {
  constructor(
    @InjectRepository(Rental) private rentalRepository: Repository<Rental>,
  ) {}

  async create(body: CreateRentalDto) {
    try {
      const newRental = await this.rentalRepository.save({
        ...body,
      });

      return {
        message: 'Alquiler creado exitosamente',
        data: newRental,
      };
    } catch {
      throw new BadRequestException('Error al crear el alquiler');
    }
  }

  async findAll() {
    const rentals = await this.rentalRepository.find();
    return {
      data: rentals,
      count: rentals.length,
    };
  }

  async findOne(id: number) {
    const rental = await this.rentalRepository.findOne({
      where: { id },
    });
    if (!rental) {
      throw new NotFoundException(`Alquiler con ID ${id} no encontrado`);
    }
    return rental;
  }

  async update(id: number, change: UpdateRentalDto) {
    const rental = await this.findOne(id);
    try {
      const updatedRental = this.rentalRepository.merge(rental, change);
      const savedRental = await this.rentalRepository.save(updatedRental);
      return {
        data: savedRental,
        message: 'Alquiler actualizado exitosamente',
      };
    } catch {
      throw new BadRequestException('Error al actualizar el alquiler');
    }
  }

  async delete(id: number) {
    await this.findOne(id);
    try {
      await this.rentalRepository.delete(id);
      return {
        message: 'Alquiler eliminado exitosamente',
      };
    } catch {
      throw new BadRequestException('Error al eliminar el alquiler');
    }
  }
}