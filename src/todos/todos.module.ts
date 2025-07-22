import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { TodosRepository } from './todos.repository';

@Module({
  providers: [
    TodosService,
    TodosRepository,
    {
      provide: 'ACCESS TOKEN',
      useValue: 'Esta es mi clave secreta',
    },
  ],
  controllers: [TodosController],
})
export class TodosModule {}
