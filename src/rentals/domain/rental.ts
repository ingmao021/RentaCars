import { RentalStatus } from './rental-status.enum.js';
import { InvalidRentalDatesError, InvalidRentalStatusError } from './rental.errors.js';

const MS_PER_DAY = 86_400_000;

export interface RentalProps {
  id?: number;
  carId: number;
  customerId: number;
  startDate: Date;
  endDate: Date;
  totalCost: number;
  status: RentalStatus;
  returnedAt: Date | null;
  createdAt?: Date;
}

export interface CreateRentalParams {
  carId: number;
  customerId: number;
  startDate: Date;
  endDate: Date;
  pricePerDay: number;
}

/**
 * Entidad de dominio: TypeScript puro, sin decoradores de Nest ni de TypeORM.
 * Aquí viven las reglas de negocio propias de una renta.
 */
export class Rental {
  private constructor(private readonly props: RentalProps) {}

  static create(params: CreateRentalParams): Rental {
    if (params.endDate <= params.startDate) {
      throw new InvalidRentalDatesError();
    }

    const days = Rental.daysBetween(params.startDate, params.endDate);
    const totalCost = Math.round(days * params.pricePerDay * 100) / 100;

    return new Rental({
      carId: params.carId,
      customerId: params.customerId,
      startDate: params.startDate,
      endDate: params.endDate,
      totalCost,
      status: RentalStatus.ACTIVE,
      returnedAt: null,
    });
  }

  /** Reconstruye una renta que ya existe en la base de datos. */
  static fromPersistence(props: RentalProps): Rental {
    return new Rental(props);
  }

  static daysBetween(start: Date, end: Date): number {
    return Math.round((end.getTime() - start.getTime()) / MS_PER_DAY);
  }

  markAsReturned(at: Date = new Date()): void {
    this.ensureActive('devolver');
    this.props.status = RentalStatus.RETURNED;
    this.props.returnedAt = at;
  }

  cancel(): void {
    this.ensureActive('cancelar');
    this.props.status = RentalStatus.CANCELLED;
  }

  private ensureActive(action: string): void {
    if (this.props.status !== RentalStatus.ACTIVE) {
      throw new InvalidRentalStatusError(action, this.props.status);
    }
  }

  get id() { return this.props.id; }
  get carId() { return this.props.carId; }
  get customerId() { return this.props.customerId; }
  get startDate() { return this.props.startDate; }
  get endDate() { return this.props.endDate; }
  get totalCost() { return this.props.totalCost; }
  get status() { return this.props.status; }
  get returnedAt() { return this.props.returnedAt; }
  get createdAt() { return this.props.createdAt; }
}
