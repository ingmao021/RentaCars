import { IsEmail, IsString, IsNotEmpty, Length } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
    @Length(3,8)
    nickname?: string;
}

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsNotEmpty()
    @IsEmail()
    email?: string;
}
