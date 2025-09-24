import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../../database/entities/user.entity';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Omit<UserEntity, 'password'> => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.id;
  },
);
