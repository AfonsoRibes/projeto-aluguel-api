import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { UserRepository } from '../entities/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async register(name: string, email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    return this.userRepository.create({ name, email, password: hashed });
  }

  async login(login: string, password: string) {
    const user = await this.userRepository.findByEmail(login);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const accessToken = this.jwtService.sign({ sub: user._id });
    const refreshToken = uuid();
    await this.userRepository.update(String(user._id), { refreshToken });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    const user = await this.userRepository.findByRefreshToken(refreshToken);
    if (!user) throw new UnauthorizedException('Refresh token inválido');

    const accessToken = this.jwtService.sign({ sub: user._id });
    return { accessToken };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return;

    const token = uuid();
    await this.userRepository.update(String(user._id), { resetToken: token });

    // Aqui você enviaria o token por e-mail.
    return token;
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userRepository.findByResetToken(token);
    if (!user) throw new UnauthorizedException('Token inválido');

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(String(user._id), {
      password: hashed,
      resetToken: undefined,
    });
  }
}
