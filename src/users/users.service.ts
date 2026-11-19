import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { Profile } from './entities/profile.entity.js';
import { User } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  async create(body: CreateUserDto) {
    await this.validateEmail(body.email);
    await this.validateDriverLicense(body.profile.driverLicense);
    try {
      const newUser = await this.userRepository.save(body);
      return {
        message: 'Usuario creado exitosamente',
        data: newUser,
      };
    } catch {
      throw new BadRequestException('Error al crear el usuario');
    }
  }

  async findAll() {
    const users = await this.userRepository.find({
      relations: { profile: true, rentals: true },
    });
    return {
      data: users,
      count: users.length,
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { profile: true, rentals: { car: true } },
    });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no existe`);
    }
    return user;
  }

  async update(id: number, changes: UpdateUserDto) {
    const user = await this.findOne(id);
    if (changes.email) {
      await this.validateEmail(changes.email, id);
    }
    if (changes.profile?.driverLicense) {
      await this.validateDriverLicense(
        changes.profile.driverLicense,
        user.profile.id,
      );
    }
    try {
      const updatedUser = this.userRepository.merge(user, changes);
      const savedUser = await this.userRepository.save(updatedUser);
      return {
        message: 'Usuario actualizado exitosamente',
        data: savedUser,
      };
    } catch {
      throw new BadRequestException('Error al actualizar el usuario');
    }
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    try {
      await this.userRepository.delete(user.id);
      await this.profileRepository.delete(user.profile.id);
      return {
        message: 'Usuario eliminado exitosamente',
        data: user,
      };
    } catch {
      throw new BadRequestException('Error al eliminar el usuario');
    }
  }

  private async validateEmail(email: string, currentId?: number) {
    const found = await this.userRepository.findOne({ where: { email } });
    if (found && found.id !== currentId) {
      throw new BadRequestException(
        `Ya existe un usuario con el email ${email}`,
      );
    }
  }

  private async validateDriverLicense(
    driverLicense: string,
    currentProfileId?: number,
  ) {
    const found = await this.profileRepository.findOne({
      where: { driverLicense },
    });
    if (found && found.id !== currentProfileId) {
      throw new BadRequestException(
        `Ya existe un usuario con la licencia ${driverLicense}`,
      );
    }
  }
}
