import { Inject, Injectable } from '@nestjs/common';
import { TodosRepository } from './todos.repository';

@Injectable()
export class TodosService {
  constructor(
    private todosRepository: TodosRepository,
    @Inject('ACCESS TOKEN') private accessToken: string,
  ) {}

  getTodos() {
    return this.accessToken === 'Esta es mi clave secreta'
      ? this.todosRepository.getTodos()
      : 'No tienes acceso a los todos';
  }
}
