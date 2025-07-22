import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersDbService } from './usersDb.service';
import { User } from './users.entity';

describe('authService', () => {
  let authService: AuthService;

  const mockUser: Omit<User, 'id'> = {
    name: 'Testing',
    createdAt: '01/01/2000',
    password: '123456',
    email: 'testing@mail.com',
    isAdmin: false,
  };

  beforeEach(async () => {
    const mockUsersService: Partial<UsersDbService> = {
      getUserByEmail: () => Promise.resolve(null),
      saveUser: (user: Omit<User, 'id'>): Promise<User> =>
        Promise.resolve({
          ...user,
          isAdmin: false,
          id: '1234fs-234sd-24csfd-34sdfg',
        }),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: UsersDbService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('Create an instance of AuthService', () => {
    expect(authService).toBeDefined();
  });

  it('signUp() creates a new user with an encrypted password', async () => {
    const user = await authService.singUp(mockUser);
    expect(user).toBeDefined();
  });
});
