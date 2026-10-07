import { describe, expect, it } from 'vitest';
import { Rental } from './rental.js';
import { RentalStatus } from './rental-status.enum.js';
import { InvalidRentalDatesError, InvalidRentalStatusError } from './rental.errors.js';

const baseParams = {
  carId: 1,
  customerId: 1,
  startDate: new Date('2026-10-10'),
  endDate: new Date('2026-10-13'),
  pricePerDay: 100000,
};

describe('Rental', () => {
  it('calcula el costo total como días × precio por día', () => {
    const rental = Rental.create(baseParams);
    expect(rental.totalCost).toBe(300000);
    expect(rental.status).toBe(RentalStatus.ACTIVE);
  });

  it('rechaza una fecha de fin igual o anterior a la de inicio', () => {
    expect(() =>
      Rental.create({ ...baseParams, endDate: new Date('2026-10-10') }),
    ).toThrow(InvalidRentalDatesError);
  });

  it('registra la devolución de una renta activa', () => {
    const rental = Rental.create(baseParams);
    rental.markAsReturned();
    expect(rental.status).toBe(RentalStatus.RETURNED);
    expect(rental.returnedAt).toBeInstanceOf(Date);
  });

  it('no permite devolver una renta cancelada', () => {
    const rental = Rental.create(baseParams);
    rental.cancel();
    expect(() => rental.markAsReturned()).toThrow(InvalidRentalStatusError);
  });
});
