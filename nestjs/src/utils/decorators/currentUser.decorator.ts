/* eslint-disable prettier/prettier */
import { UserEntity } from '@/users/entities/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data, context:ExecutionContext) : UserEntity => {
  const request = context.switchToHttp().getRequest();
  return request.user;
});;
