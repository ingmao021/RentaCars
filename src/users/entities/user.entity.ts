import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from './profile.entity.js';
import { Rental } from '../../rentals/entities/rental.entity.js';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @OneToOne(() => Profile, (profile) => profile.user, {
    nullable: false,
    cascade: true,
  })
  @JoinColumn({ name: 'profile_id' })
  profile: Relation<Profile>;

  @OneToMany(() => Rental, (rental) => rental.user)
  rentals: Relation<Rental[]>;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt: Date;
}
