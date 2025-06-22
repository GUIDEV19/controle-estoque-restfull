import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUserDto } from '../../users/dto/user.dto';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthenticatedUserDto => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
); 