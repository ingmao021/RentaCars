import { PartialType } from '@nestjs/mapped-types';
import { CreateRentalDto } from './create-rental.dto.js';

export class UpdateRentalDto extends PartialType(CreateRentalDto) {}