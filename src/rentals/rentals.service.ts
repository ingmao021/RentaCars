import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRentalDto, ListRentalsQueryDto } from './rental.dto.js';
import { Rental, RentalStatus } from './rental.model.js';

const MS_PER_DAY = 86_400_000;

// Datos TEMPORALES mientras los módulos de cars y customers no estén listos.
const CARS = [
  { id: 1, pricePerDay: 120000, inMaintenance: false },
  { id: 2, pricePerDay: 95000, inMaintenance: false },
  { id: 3, pricePerDay: 150000, inMaintenance: true },
];

const CUSTOMERS = [
  { id: 1, licenseExpiration: '2029-12-31' },
  { id: 2, licenseExpiration: '2024-01-01' }, // licencia vencida
];

@Injectable()
export class RentalsService {
  private rentals: Rental[] = [];
  private nextId = 1;

  create(dto: CreateRentalDto): Rental {
    if (dto.endDate <= dto.startDate) {
      throw new BadRequestException('La fecha de fin debe ser posterior a la fecha de inicio');
    }

    const customer = CUSTOMERS.find((c) => c.id === dto.customerId);
    if (!customer) {
      throw new NotFoundException(`El cliente con id ${dto.customerId} no existe`);
    }
    if (customer.licenseExpiration < dto.endDate) {
      throw new BadRequestException('La licencia del cliente vence antes de terminar la renta');
    }

    const car = CARS.find((c) => c.id === dto.carId);
    if (!car) {
      throw new NotFoundException(`El carro con id ${dto.carId} no existe`);
    }
    if (car.inMaintenance) {
      throw new ConflictException('El carro está en mantenimiento');
    }

    if (this.hasOverlap(dto.carId, dto.startDate, dto.endDate)) {
      throw new ConflictException('El carro ya tiene una renta activa en esas fechas');
    }

    const days =
      (new Date(dto.endDate).getTime() - new Date(dto.startDate).getTime()) / MS_PER_DAY;

    const rental: Rental = {
      id: this.nextId++,
      carId: dto.carId,
      customerId: dto.customerId,
      startDate: dto.startDate,
      endDate: dto.endDate,
      totalCost: days * car.pricePerDay, // lo calcula el backend, nunca el cliente
      status: RentalStatus.ACTIVE,
      returnedAt: null,
      createdAt: new Date(),
    };

    this.rentals.push(rental);
    return rental;
  }

  findAll(query: ListRentalsQueryDto): Rental[] {
    return this.rentals.filter(
      (r) =>
        (query.carId === undefined || r.carId === query.carId) &&
        (query.customerId === undefined || r.customerId === query.customerId) &&
        (query.status === undefined || r.status === query.status),
    );
  }

  findOne(id: number): Rental {
    const rental = this.rentals.find((r) => r.id === id);
    if (!rental) {
      throw new NotFoundException(`La renta con id ${id} no existe`);
    }
    return rental;
  }

  returnRental(id: number): Rental {
    const rental = this.findOne(id);
    this.ensureActive(rental, 'devolver');
    rental.status = RentalStatus.RETURNED;
    rental.returnedAt = new Date();
    return rental;
  }

  cancel(id: number): Rental {
    const rental = this.findOne(id);
    this.ensureActive(rental, 'cancelar');
    rental.status = RentalStatus.CANCELLED;
    return rental;
  }

  /** Hay cruce si: inicio existente < fin nuevo  Y  fin existente > inicio nuevo */
  private hasOverlap(carId: number, startDate: string, endDate: string): boolean {
    return this.rentals.some(
      (r) =>
        r.carId === carId &&
        r.status === RentalStatus.ACTIVE &&
        r.startDate < endDate &&
        r.endDate > startDate,
    );
  }

  private ensureActive(rental: Rental, action: string): void {
    if (rental.status !== RentalStatus.ACTIVE) {
      throw new ConflictException(`No se puede ${action} una renta en estado ${rental.status}`);
    }
  }
}
