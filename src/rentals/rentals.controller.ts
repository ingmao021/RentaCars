import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CreateRentalDto, ListRentalsQueryDto } from './rental.dto.js';
import { RentalsService } from './rentals.service.js';

@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  create(@Body() dto: CreateRentalDto) {
    return this.rentalsService.create(dto);
  }

  @Get()
  findAll(@Query() query: ListRentalsQueryDto) {
    return this.rentalsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rentalsService.findOne(id);
  }

  @Patch(':id/return')
  returnRental(@Param('id', ParseIntPipe) id: number) {
    return this.rentalsService.returnRental(id);
  }

  @Patch(':id/cancel')
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.rentalsService.cancel(id);
  }
}
