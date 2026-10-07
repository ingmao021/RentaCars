import { Injectable } from '@nestjs/common';
import { Rental } from '../../domain/rental.js';
import { RentalStatus } from '../../domain/rental-status.enum.js';
import { RentalFilters, RentalRepository } from '../../domain/rental.repository.js';

/** Repositorio TEMPORAL en memoria: permite probar sin PostgreSQL. */
@Injectable()
export class InMemoryRentalRepository extends RentalRepository {
  private readonly rows = new Map<number, Rental>();
  private nextId = 1;

  async save(rental: Rental): Promise<Rental> {
    const id = rental.id ?? this.nextId++;
    const stored = Rental.fromPersistence({
      id,
      carId: rental.carId,
      customerId: rental.customerId,
      startDate: rental.startDate,
      endDate: rental.endDate,
      totalCost: rental.totalCost,
      status: rental.status,
      returnedAt: rental.returnedAt,
      createdAt: rental.createdAt ?? new Date(),
    });
    this.rows.set(id, stored);
    return stored;
  }

  async findById(id: number): Promise<Rental | null> {
    return this.rows.get(id) ?? null;
  }

  async findAll(filters: RentalFilters): Promise<Rental[]> {
    return [...this.rows.values()].filter(
      (r) =>
        (filters.carId === undefined || r.carId === filters.carId) &&
        (filters.customerId === undefined || r.customerId === filters.customerId) &&
        (filters.status === undefined || r.status === filters.status),
    );
  }

  async hasOverlap(carId: number, startDate: Date, endDate: Date): Promise<boolean> {
    return [...this.rows.values()].some(
      (r) =>
        r.carId === carId &&
        r.status === RentalStatus.ACTIVE &&
        r.startDate < endDate &&
        r.endDate > startDate,
    );
  }
}
