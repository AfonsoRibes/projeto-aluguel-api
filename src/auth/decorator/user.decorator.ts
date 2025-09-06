import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../../database/entities/user.entity';
import { ObjectId } from 'mongoose';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Omit<UserEntity, 'password'> => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ObjectId | string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?._id; // retorna apenas o id
  },
);
