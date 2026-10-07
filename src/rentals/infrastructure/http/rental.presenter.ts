import { Rental } from '../../domain/rental.js';
import { toDateOnly } from '../date-only.js';

/** Define cómo se ve una renta en el JSON de respuesta. */
export class RentalPresenter {
  static toHttp(rental: Rental) {
    return {
      id: rental.id,
      carId: rental.carId,
      customerId: rental.customerId,
      startDate: toDateOnly(rental.startDate),
      endDate: toDateOnly(rental.endDate),
      totalCost: rental.totalCost,
      status: rental.status,
      returnedAt: rental.returnedAt,
      createdAt: rental.createdAt,
    };
  }
}
