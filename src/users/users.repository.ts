import { Injectable } from '@nestjs/common';
import { User } from './user.interface';

@Injectable()
export class UsersRepository {
  private users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'jdoe@mail.com',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jsmith@mail.com',
    },
    {
      id: 3,
      name: 'Carlos Pérez',
      email: 'cperez@mail.com',
    },
  ];

  getUsers() {
    return this.users;
  }

  getById(id: number) {
    return this.users.find((user) => user.id === id);
  }

  getByName(name: string) {
    return this.users.find((user) => user.name === name);
  }

  async createUser(user: Omit<User, 'id'>) {
    const id = this.users.length + 1;
    this.users = [...this.users, { id, ...user }];
    return { id, ...user };
  }
}
