import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: MongoRepository<UserEntity>,
  ) {
    super(userRepo);
  }

  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findByResetToken(token: string): Promise<UserEntity | null> {
    return this.userRepo.findOne({ where: { resetToken: token } });
  }

  async findByRefreshToken(token: string): Promise<UserEntity | null> {
    return this.userRepo.findOne({ where: { refreshToken: token } });
  }

  async update(
    id: string,
    data: Partial<UserEntity>,
  ): Promise<UserEntity | null> {
    const objectId = new (require('mongodb').ObjectId)(id);
    await this.userRepo.updateOne({ _id: objectId }, { $set: data });
    return this.userRepo.findOne({ where: { _id: objectId } });
  }

  async findById(id: string): Promise<Omit<UserEntity, 'password'> | null> {
    const objectId = new ObjectId(id);
    const user = await this.userRepo.findOne({ where: { _id: objectId } });

    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async delete(id: string): Promise<void> {
    const objectId = new (require('mongodb').ObjectId)(id);
    await this.userRepo.deleteOne({ _id: objectId });
  }
}
