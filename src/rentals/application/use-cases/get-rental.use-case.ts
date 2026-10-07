import { Rental } from '../../domain/rental.js';
import { RentalNotFoundError } from '../../domain/rental.errors.js';
import { RentalRepository } from '../../domain/rental.repository.js';

export class GetRentalUseCase {
  constructor(private readonly rentals: RentalRepository) {}

  async execute(id: number): Promise<Rental> {
    const rental = await this.rentals.findById(id);
    if (!rental) throw new RentalNotFoundError(id);
    return rental;
  }
}
