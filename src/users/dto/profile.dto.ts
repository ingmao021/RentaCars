import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  driverLicense: string;
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
