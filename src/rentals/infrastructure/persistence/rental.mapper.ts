import { Rental } from '../../domain/rental.js';
import { toDateOnly } from '../date-only.js';
import { RentalOrmEntity } from './rental.orm-entity.js';

/** Traduce entre la entidad de dominio y el modelo de TypeORM. */
export class RentalMapper {
  static toDomain(orm: RentalOrmEntity): Rental {
    return Rental.fromPersistence({
      id: orm.id,
      carId: orm.carId,
      customerId: orm.customerId,
      startDate: new Date(orm.startDate),
      endDate: new Date(orm.endDate),
      totalCost: Number(orm.totalCost),
      status: orm.status,
      returnedAt: orm.returnedAt,
      createdAt: orm.createdAt,
    });
  }

  static toOrm(rental: Rental): Partial<RentalOrmEntity> {
    return {
      id: rental.id,
      carId: rental.carId,
      customerId: rental.customerId,
      startDate: toDateOnly(rental.startDate),
      endDate: toDateOnly(rental.endDate),
      totalCost: rental.totalCost.toFixed(2),
      status: rental.status,
      returnedAt: rental.returnedAt,
    };
  }
}
