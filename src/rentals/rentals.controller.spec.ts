import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { RentalsController } from './rentals.controller.js';
import { RentalsService } from './rentals.service.js';

describe('RentalsController', () => {
  let controller: RentalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentalsController],
      providers: [RentalsService],
    }).compile();

    controller = module.get<RentalsController>(RentalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('crea una renta y luego la encuentra por id', () => {
    const created = controller.create({
      carId: 1,
      customerId: 1,
      startDate: '2026-10-10',
      endDate: '2026-10-13',
    });
    expect(controller.findOne(created.id)).toEqual(created);
  });
});
