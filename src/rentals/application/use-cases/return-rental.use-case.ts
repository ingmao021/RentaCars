import { Rental } from '../../domain/rental.js';
import { RentalNotFoundError } from '../../domain/rental.errors.js';
import { RentalRepository } from '../../domain/rental.repository.js';
import { CarGateway } from '../ports/car.gateway.js';

export class ReturnRentalUseCase {
  constructor(
    private readonly rentals: RentalRepository,
    private readonly cars: CarGateway,
  ) {}

  async execute(id: number): Promise<Rental> {
    const rental = await this.rentals.findById(id);
    if (!rental) throw new RentalNotFoundError(id);

    rental.markAsReturned(); // la entidad valida que esté ACTIVE

    const saved = await this.rentals.save(rental);
    await this.cars.markAsAvailable(rental.carId);
    return saved;
  }
}
