import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
} from '@nestjs/swagger';

import { ValidRoles } from 'src/enum';
import { RoleProtected } from './role-protected.decorator';
import { UserRoleGuard } from '../guards';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard('jwt'), UserRoleGuard),
    ApiBearerAuth('defaultBearerAuth')
  );
}

