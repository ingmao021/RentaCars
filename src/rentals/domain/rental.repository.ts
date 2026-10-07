import { Rental } from './rental.js';
import { RentalStatus } from './rental-status.enum.js';

export interface RentalFilters {
  carId?: number;
  customerId?: number;
  status?: RentalStatus;
}

/**
 * Puerto (contrato) del repositorio. El dominio define QUÉ necesita;
 * la infraestructura decide CÓMO (TypeORM, memoria, etc.).
 * Es una clase abstracta para poder usarla como token de inyección en Nest.
 */
export abstract class RentalRepository {
  abstract save(rental: Rental): Promise<Rental>;
  abstract findById(id: number): Promise<Rental | null>;
  abstract findAll(filters: RentalFilters): Promise<Rental[]>;
  /** true si existe otra renta ACTIVE del carro que se cruce con el rango dado. */
  abstract hasOverlap(carId: number, startDate: Date, endDate: Date): Promise<boolean>;
}
