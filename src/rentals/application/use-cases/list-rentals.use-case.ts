import { Rental } from '../../domain/rental.js';
import { RentalFilters, RentalRepository } from '../../domain/rental.repository.js';

export class ListRentalsUseCase {
  constructor(private readonly rentals: RentalRepository) {}

  execute(filters: RentalFilters): Promise<Rental[]> {
    return this.rentals.findAll(filters);
  }
}
