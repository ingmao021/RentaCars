import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it } from 'vitest';
import { RentalStatus } from './rental.model.js';
import { RentalsService } from './rentals.service.js';

const validDto = { carId: 1, customerId: 1, startDate: '2026-10-10', endDate: '2026-10-13' };

describe('RentalsService', () => {
  let service: RentalsService;

  beforeEach(() => {
    service = new RentalsService();
  });

  it('crea una renta y calcula el costo (3 días × 120000)', () => {
    const rental = service.create(validDto);
    expect(rental.totalCost).toBe(360000);
    expect(rental.status).toBe(RentalStatus.ACTIVE);
  });

  it('rechaza fechas invertidas', () => {
    expect(() => service.create({ ...validDto, endDate: '2026-10-05' })).toThrow(BadRequestException);
  });

  it('rechaza un cliente con licencia vencida', () => {
    expect(() => service.create({ ...validDto, customerId: 2 })).toThrow(BadRequestException);
  });

  it('rechaza un carro en mantenimiento', () => {
    expect(() => service.create({ ...validDto, carId: 3 })).toThrow(ConflictException);
  });

  it('rechaza fechas que se cruzan con otra renta activa', () => {
    service.create(validDto);
    expect(() => service.create({ ...validDto, startDate: '2026-10-11', endDate: '2026-10-14' })).toThrow(
      ConflictException,
    );
  });

  it('registra la devolución y no permite devolver dos veces', () => {
    const rental = service.create(validDto);
    expect(service.returnRental(rental.id).status).toBe(RentalStatus.RETURNED);
    expect(() => service.returnRental(rental.id)).toThrow(ConflictException);
  });

  it('lanza 404 si la renta no existe', () => {
    expect(() => service.findOne(99)).toThrow(NotFoundException);
  });
});
