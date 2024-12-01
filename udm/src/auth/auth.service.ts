import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const payload: JwtPayload = { username: user.username, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async register(username: string, password: string, role: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.create(username, hashedPassword, role);
  }
}
