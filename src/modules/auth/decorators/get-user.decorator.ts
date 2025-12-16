import {
  ExecutionContext,
  createParamDecorator,
  BadRequestException,
} from '@nestjs/common';

import { Errors } from 'src/enum';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();

  const user = req.user;

  if (!user) throw new BadRequestException(Errors.USER_NOT_FOUND);

  return data ? user[data] : user;
});
