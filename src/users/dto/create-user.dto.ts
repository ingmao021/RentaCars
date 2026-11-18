import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateProfileDto } from './profile.dto.js';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ValidateNested()
  @Type(() => CreateProfileDto)
  @IsNotEmpty()
  profile: CreateProfileDto;
}
