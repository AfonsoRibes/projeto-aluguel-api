import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from '../../entities/user/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async update(id: string, data: UpdateUserDto) {
    return this.userRepository.update(id, data);
  }

  async delete(id: string) {
    return this.userRepository.delete(id);
  }
}
