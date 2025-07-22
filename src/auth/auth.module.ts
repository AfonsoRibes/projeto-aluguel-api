import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../entities/user/user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/auth.strategy';
import { User } from '../entities/user/user.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: 'JWT_SECRET',
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, JwtStrategy],
})
export class AuthModule {}
