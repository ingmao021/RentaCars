import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CancelRentalUseCase } from '../../application/use-cases/cancel-rental.use-case.js';
import { CreateRentalUseCase } from '../../application/use-cases/create-rental.use-case.js';
import { GetRentalUseCase } from '../../application/use-cases/get-rental.use-case.js';
import { ListRentalsUseCase } from '../../application/use-cases/list-rentals.use-case.js';
import { ReturnRentalUseCase } from '../../application/use-cases/return-rental.use-case.js';
import { CreateRentalDto } from './dto/create-rental.dto.js';
import { ListRentalsQueryDto } from './dto/list-rentals-query.dto.js';
import { RentalPresenter } from './rental.presenter.js';

/**
 * El controller solo traduce HTTP ⇄ casos de uso.
 * No contiene reglas de negocio ni accede a la base de datos.
 */
@Controller('rentals')
export class RentalsController {
  constructor(
    private readonly createRental: CreateRentalUseCase,
    private readonly listRentals: ListRentalsUseCase,
    private readonly getRental: GetRentalUseCase,
    private readonly returnRental: ReturnRentalUseCase,
    private readonly cancelRental: CancelRentalUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateRentalDto) {
    const rental = await this.createRental.execute({
      carId: dto.carId,
      customerId: dto.customerId,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
    });
    return RentalPresenter.toHttp(rental);
  }

  @Get()
  async findAll(@Query() query: ListRentalsQueryDto) {
    const rentals = await this.listRentals.execute(query);
    return rentals.map((rental) => RentalPresenter.toHttp(rental));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return RentalPresenter.toHttp(await this.getRental.execute(id));
  }

  @Patch(':id/return')
  async return(@Param('id', ParseIntPipe) id: number) {
    return RentalPresenter.toHttp(await this.returnRental.execute(id));
  }

  @Patch(':id/cancel')
  async cancel(@Param('id', ParseIntPipe) id: number) {
    return RentalPresenter.toHttp(await this.cancelRental.execute(id));
  }
}
