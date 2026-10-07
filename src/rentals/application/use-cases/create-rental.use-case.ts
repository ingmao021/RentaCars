import { Rental } from '../../domain/rental.js';
import { RentalRepository } from '../../domain/rental.repository.js';
import {
  CarNotAvailableError,
  CarNotFoundError,
  CustomerNotFoundError,
  LicenseExpiredError,
} from '../../domain/rental.errors.js';
import { CarGateway } from '../ports/car.gateway.js';
import { CustomerGateway } from '../ports/customer.gateway.js';

export interface CreateRentalCommand {
  carId: number;
  customerId: number;
  startDate: Date;
  endDate: Date;
}

export class CreateRentalUseCase {
  constructor(
    private readonly rentals: RentalRepository,
    private readonly cars: CarGateway,
    private readonly customers: CustomerGateway,
  ) {}

  async execute(command: CreateRentalCommand): Promise<Rental> {
    const customer = await this.customers.findById(command.customerId);
    if (!customer || !customer.isActive) {
      throw new CustomerNotFoundError(command.customerId);
    }
    if (customer.licenseExpiration < command.endDate) {
      throw new LicenseExpiredError();
    }

    const car = await this.cars.findById(command.carId);
    if (!car || !car.isActive) {
      throw new CarNotFoundError(command.carId);
    }
    if (car.inMaintenance) {
      throw new CarNotAvailableError('está en mantenimiento');
    }

    // La entidad valida las fechas y calcula el costo con el precio del carro.
    const rental = Rental.create({ ...command, pricePerDay: car.pricePerDay });

    const overlaps = await this.rentals.hasOverlap(
      command.carId,
      command.startDate,
      command.endDate,
    );
    if (overlaps) {
      throw new CarNotAvailableError('ya tiene una renta activa en esas fechas');
    }

    const saved = await this.rentals.save(rental);
    await this.cars.markAsRented(car.id);
    return saved;
  }
}
