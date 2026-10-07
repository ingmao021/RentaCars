import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { RentalsModule } from './rentals/rentals.module.js';

@Module({
  imports: [RentalsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
