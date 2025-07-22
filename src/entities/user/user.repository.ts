// src/entities/user.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: MongoRepository<User>,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { resetToken: token } });
  }

  async findByRefreshToken(token: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { refreshToken: token } });
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const objectId = new (require('mongodb').ObjectId)(id);
    await this.userRepo.updateOne({ _id: objectId }, { $set: data });
    return this.userRepo.findOne({ where: { _id: objectId } });
  }
}
