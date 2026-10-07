import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rental } from '../../domain/rental.js';
import { RentalStatus } from '../../domain/rental-status.enum.js';
import { RentalFilters, RentalRepository } from '../../domain/rental.repository.js';
import { toDateOnly } from '../date-only.js';
import { RentalMapper } from './rental.mapper.js';
import { RentalOrmEntity } from './rental.orm-entity.js';

@Injectable()
export class TypeOrmRentalRepository extends RentalRepository {
  constructor(
    @InjectRepository(RentalOrmEntity)
    private readonly repo: Repository<RentalOrmEntity>,
  ) {
    super();
  }

  async save(rental: Rental): Promise<Rental> {
    const saved = await this.repo.save(RentalMapper.toOrm(rental));
    const reloaded = await this.repo.findOneByOrFail({ id: saved.id });
    return RentalMapper.toDomain(reloaded);
  }

  async findById(id: number): Promise<Rental | null> {
    const orm = await this.repo.findOneBy({ id });
    return orm ? RentalMapper.toDomain(orm) : null;
  }

  async findAll(filters: RentalFilters): Promise<Rental[]> {
    const rows = await this.repo.find({
      where: {
        carId: filters.carId,
        customerId: filters.customerId,
        status: filters.status,
      },
      order: { createdAt: 'DESC' },
    });
    return rows.map((row) => RentalMapper.toDomain(row));
  }

  async hasOverlap(carId: number, startDate: Date, endDate: Date): Promise<boolean> {
    // Hay cruce si: start_existente < end_nuevo  Y  end_existente > start_nuevo
    const count = await this.repo
      .createQueryBuilder('r')
      .where('r.carId = :carId', { carId })
      .andWhere('r.status = :status', { status: RentalStatus.ACTIVE })
      .andWhere('r.startDate < :endDate', { endDate: toDateOnly(endDate) })
      .andWhere('r.endDate > :startDate', { startDate: toDateOnly(startDate) })
      .getCount();
    return count > 0;
  }
}
