import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto.js';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    //primer metodo para retornar la lista de usuarios
    @Get()
    getAllUSers() {
        return this.userService.findAll();
    }

    @Get(':id')
    getUserById(@Param('id') id: string) {
        return this.userService.findById(id);
    }

    //crear un endpoint para buscar por el nombre y retornar el correo
    @Get('search/:name')
    getUserByName(@Param('name') name: string) {
        return this.userService.searchByName(name);
    }

    @Post()
    createUser(@Body() userPayload: CreateUserDto) {
        return this.userService.createUser(userPayload);
    }

    @Delete(':id')
    deleteUser(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }

    @Put(':id')
    updateUser(@Param('id') id: string, @Body() changes: UpdateUserDto) {
        return this.userService.updateUser(id, changes);
    }
}
