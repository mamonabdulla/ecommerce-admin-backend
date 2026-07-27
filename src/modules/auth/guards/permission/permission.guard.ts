import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import {
  PERMISSION_KEY,
} from '../../../../common/decorators/permission.decorator';


@Injectable()
export class PermissionGuard
implements CanActivate {


  constructor(
    private readonly reflector: Reflector,
  ) {}



  canActivate(
    context: ExecutionContext,
  ): boolean {


    const requiredPermission =
      this.reflector.get<string>(
        PERMISSION_KEY,
        context.getHandler(),
      );



    // If route has no permission requirement
    // allow access

    if (!requiredPermission) {
      return true;
    }



    const request =
      context.switchToHttp()
      .getRequest();



    const user =
      request.user;



    if (!user) {

      throw new ForbiddenException(
        'User not found',
      );

    }



    const hasPermission =
      user.permissions?.includes(
        requiredPermission,
      );



    if (!hasPermission) {

      throw new ForbiddenException(
        'You do not have permission',
      );

    }



    return true;

  }

}