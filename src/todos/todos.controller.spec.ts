import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

describe('TodosController', () => {
  let todosController: TodosController;

  const mockTodosService = {
    getTodos: jest.fn().mockReturnValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [{ provide: TodosService, useValue: mockTodosService }],
    }).compile();
    todosController = module.get<TodosController>(TodosController);
  });

  it('Should be defined', () => {
    expect(todosController).toBeDefined();
  });
});
