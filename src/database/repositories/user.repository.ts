import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
  private readonly userRepo: Repository<UserEntity>,
  ) {
    super(userRepo);
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
    await this.userRepo.update(id, data);
    return this.userRepo.findOne({ where: { id } });
  }

  async findUserById(id: string): Promise<Omit<UserEntity, 'password'> | null> {
  const user = await this.userRepo.findOne({ where: { id } });

    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
