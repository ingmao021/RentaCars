import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeUsersController } from './type-users/type-users.controller.js';
import { TypeUsersService } from './type-users/type-users.service.js';

@Module({
  imports: [],
  controllers: [AppController, TypeUsersController],
  providers: [AppService, TypeUsersService],
})
export class AppModule {}
