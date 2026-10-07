import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import type { User } from './user.model.js';
import { CreateUserDto, UpdateUserDto } from './user.dto.js';

@Injectable()
export class UsersService {
    private users: User[] = [
        { id: '1', name: 'John Doe',       email: 'john.doe@example.com',       isActive: true  },
        { id: '2', name: 'Jane Smith',     email: 'jane.smith@example.com',     isActive: false },
        { id: '3', name: 'Alice Johnson',  email: 'alice.johnson@example.com',  isActive: true  },
        { id: '4', name: 'Bob Brown',      email: 'bob.brown@example.com',      isActive: false },
        { id: '5', name: 'Charlie Wilson', email: 'charlie.wilson@example.com', isActive: true  },
    ];

    // Retorna solo los usuarios activos
    findAll(): User[] {
        return this.users.filter((user) => user.isActive);
    }

    // Si el usuario existe -> 403 Forbidden; si no existe -> 404 Not Found
    findById(id: string): User | undefined {
        const user = this.users.find((user) => user.id === id);
        console.log(user);

        if (user) {
            throw new ForbiddenException(
                `No tienes permisos para ver el usuario con id ${id}`,
            );
        }
        throw new NotFoundException(`El usuario con id ${id} no existe`);
    }

    // Busca por nombre y retorna el correo
    searchByName(name: string): any | undefined {
        const data = this.users.find((user) => user.name == name);
        console.log(data);
        if (data) {
            return {
                msg: `El correo del usuario ${name} es ${data.email}`,
                data: data,
            };
        } else {
            throw new NotFoundException(
                `El usuario con nombre ${name} no existe`,
            );
        }
    }

    createUser(userPayload: CreateUserDto) {
        const newUSer = {
            ...userPayload,
            id: `${new Date().getTime()}`,
            nickname: userPayload.name.substring(0, 3) + '123',
            isActive: true,
        };

        this.users.push(newUSer);

        return {
            msg: 'Usuario creado correctamente',
            user: userPayload,
        };
    }

    deleteUser(id: string) {
        const position = this.users.findIndex((user) => user.id === id);
        this.users.splice(position, 1);
        return {
            msg: 'Usuario eliminado correctamente',
        };
    }

    updateUser(id: string, changes: UpdateUserDto) {
        console.log('.:: ID usuario: ', id);
        console.log('.:: Cambios: ', changes);

        const position = this.users.findIndex((user) => user.id === id);
        if (position === -1) {
            throw new NotFoundException(`Usuario con ID ${id} no existe`);
        }
        const currentData = this.users[position];

        const updateUser = {
            ...currentData,
            ...changes,
        };

        this.users[position] = updateUser;

        return {
            msg: 'Usuario actualizado',
            data: updateUser,
        };
    }
}
