import { BadRequestException, Injectable } from '@nestjs/common';

import { User } from './users.entity';
import { UsersDbService } from './usersDb.service';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersDbService,
    private readonly jwtService: JwtService,
  ) {}

  async singUp(user: Omit<User, 'id'>) {
    const dbUser = await this.usersService.getUserByEmail(user.email);
    if (dbUser) {
      throw new BadRequestException('Email already exists in database');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    if (!hashedPassword) {
      throw new BadRequestException('Password not hashed');
    }
    await this.usersService.saveUser({ ...user, password: hashedPassword });
    return { success: 'User created successfully' };
  }

  async signIn(email: string, password: string) {
    const dbUser = await this.usersService.getUserByEmail(email);
    if (!dbUser) {
      throw new BadRequestException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, dbUser.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }
    console.log('Valor de isAdmin:', dbUser.isAdmin);

    const isAdmin = Boolean(dbUser.isAdmin);

    const userPayload = {
      sub: dbUser.id,
      id: dbUser.id,
      email: dbUser.email,
      // isAdmin: dbUser.isAdmin,
      roles: [isAdmin ? Role.Admin : Role.User],
    };
    const token = this.jwtService.sign(userPayload);
    return { success: 'User logged in successfully', token };
  }
}
