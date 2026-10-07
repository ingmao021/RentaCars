import { Injectable } from '@nestjs/common';
import { CarGateway, CarSnapshot } from '../../application/ports/car.gateway.js';

/**
 * Adaptador TEMPORAL con carros de prueba, para trabajar sin esperar
 * al módulo de cars. Reemplazarlo cuando cars esté listo.
 */
@Injectable()
export class InMemoryCarGateway extends CarGateway {
  private readonly cars = new Map<number, CarSnapshot & { rented: boolean }>([
    [1, { id: 1, pricePerDay: 120000, isActive: true, inMaintenance: false, rented: false }],
    [2, { id: 2, pricePerDay: 95000, isActive: true, inMaintenance: false, rented: false }],
    [3, { id: 3, pricePerDay: 150000, isActive: true, inMaintenance: true, rented: false }],
  ]);

  async findById(id: number): Promise<CarSnapshot | null> {
    return this.cars.get(id) ?? null;
  }

  async markAsRented(id: number): Promise<void> {
    const car = this.cars.get(id);
    if (car) car.rented = true;
  }

  async markAsAvailable(id: number): Promise<void> {
    const car = this.cars.get(id);
    if (car) car.rented = false;
  }
}
