import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(username: string, password: string, role: string) {
    const user = this.usersRepository.create({ username, password, role });
    await this.usersRepository.save(user);
    return user;
  }

  async findByUsername(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }

  async updateRole(username: string, role: string) {
    const user = await this.findByUsername(username);
    if (user) {
      user.role = role;
      await this.usersRepository.save(user);
    }
    return user;
  }
}
