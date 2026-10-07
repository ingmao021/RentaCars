import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RentalStatus } from '../../domain/rental-status.enum.js';

/**
 * Modelo de la tabla, separado de la entidad de dominio.
 * car_id y customer_id son columnas simples para no acoplarse a las
 * entidades de los otros módulos; la FK se puede agregar al integrar.
 */
@Entity('rentals')
export class RentalOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'car_id' })
  carId!: number;

  @Column({ name: 'customer_id' })
  customerId!: number;

  // PostgreSQL devuelve las columnas date como string 'YYYY-MM-DD'
  @Column({ name: 'start_date', type: 'date' })
  startDate!: string;

  @Column({ name: 'end_date', type: 'date' })
  endDate!: string;

  // TypeORM devuelve numeric como string
  @Column({ name: 'total_cost', type: 'numeric', precision: 10, scale: 2 })
  totalCost!: string;

  @Column({ type: 'enum', enum: RentalStatus, default: RentalStatus.ACTIVE })
  status!: RentalStatus;

  @Column({ name: 'returned_at', type: 'timestamp', nullable: true })
  returnedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
