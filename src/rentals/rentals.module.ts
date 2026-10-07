import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { CarGateway } from './application/ports/car.gateway.js';
import { CustomerGateway } from './application/ports/customer.gateway.js';
import { CancelRentalUseCase } from './application/use-cases/cancel-rental.use-case.js';
import { CreateRentalUseCase } from './application/use-cases/create-rental.use-case.js';
import { GetRentalUseCase } from './application/use-cases/get-rental.use-case.js';
import { ListRentalsUseCase } from './application/use-cases/list-rentals.use-case.js';
import { ReturnRentalUseCase } from './application/use-cases/return-rental.use-case.js';
import { RentalRepository } from './domain/rental.repository.js';
import { InMemoryCarGateway } from './infrastructure/gateways/in-memory-car.gateway.js';
import { InMemoryCustomerGateway } from './infrastructure/gateways/in-memory-customer.gateway.js';
import { RentalsController } from './infrastructure/http/rentals.controller.js';
import { InMemoryRentalRepository } from './infrastructure/persistence/in-memory-rental.repository.js';
// Para PostgreSQL, descomentar estas dos líneas y el imports de abajo:
// import { RentalOrmEntity } from './infrastructure/persistence/rental.orm-entity.js';
// import { TypeOrmRentalRepository } from './infrastructure/persistence/typeorm-rental.repository.js';

/**
 * Aquí se "conectan" los puertos con sus implementaciones.
 * Es el único archivo que hay que tocar para cambiar un adaptador.
 */
@Module({
  // imports: [TypeOrmModule.forFeature([RentalOrmEntity])],
  controllers: [RentalsController],
  providers: [
    // Puertos → adaptadores
    { provide: RentalRepository, useClass: InMemoryRentalRepository }, // luego: TypeOrmRentalRepository
    { provide: CarGateway, useClass: InMemoryCarGateway }, // TODO: cambiar al integrar cars
    { provide: CustomerGateway, useClass: InMemoryCustomerGateway }, // TODO: cambiar al integrar customers

    // Casos de uso (clases puras, sin decoradores de Nest)
    {
      provide: CreateRentalUseCase,
      useFactory: (r: RentalRepository, c: CarGateway, cu: CustomerGateway) =>
        new CreateRentalUseCase(r, c, cu),
      inject: [RentalRepository, CarGateway, CustomerGateway],
    },
    {
      provide: ListRentalsUseCase,
      useFactory: (r: RentalRepository) => new ListRentalsUseCase(r),
      inject: [RentalRepository],
    },
    {
      provide: GetRentalUseCase,
      useFactory: (r: RentalRepository) => new GetRentalUseCase(r),
      inject: [RentalRepository],
    },
    {
      provide: ReturnRentalUseCase,
      useFactory: (r: RentalRepository, c: CarGateway) => new ReturnRentalUseCase(r, c),
      inject: [RentalRepository, CarGateway],
    },
    {
      provide: CancelRentalUseCase,
      useFactory: (r: RentalRepository, c: CarGateway) => new CancelRentalUseCase(r, c),
      inject: [RentalRepository, CarGateway],
    },
  ],
})
export class RentalsModule {}
