import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../../entities/user/user.entity';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Omit<UserEntity, 'password'> => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
