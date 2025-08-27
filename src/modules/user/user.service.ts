import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../database/repositories/user.repository';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAll() {
    return this.userRepository.findAll();
  }

  async update(id: string, data: UpdateUserDto) {
    return this.userRepository.update(id, data);
  }

  async delete(id: string) {
    return this.userRepository.delete(id);
  }
}
