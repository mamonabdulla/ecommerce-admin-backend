import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { PermissionService } from './permission.service';

import { CreatePermissionGroupDto } from './dto/create-permission-group.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionGroupDto } from './dto/update-permission-group.dto';

import { RequirePermission } from '../../common/decorators/require-permission.decorator';


@Controller('permission')
export class PermissionController {


  constructor(
    private readonly permissionService:
      PermissionService,
  ) {}





  @RequirePermission('permission:create')
  @Post('groups')
  createGroup(

    @Body()
    dto: CreatePermissionGroupDto,

  ) {

    return this.permissionService.createGroup(
      dto,
    );

  }







  @RequirePermission('permission:update')
  @Patch('groups/:id')
  updateGroup(

    @Param('id')
    id: string,


    @Body()
    dto: UpdatePermissionGroupDto,

  ) {

    return this.permissionService.updateGroup(
      id,
      dto,
    );

  }








  @RequirePermission('permission:create')
  @Post()
  createPermission(

    @Body()
    dto: CreatePermissionDto,

  ) {

    return this.permissionService.createPermission(
      dto,
    );

  }








  @RequirePermission('permission:read')
  @Get()
  findAllPermissions(

    @Query('page')
    page?: string,


    @Query('limit')
    limit?: string,


    @Query('search')
    search?: string,

  ) {


    return this.permissionService.findAllPermissions(

      Number(page) || 1,

      Number(limit) || 10,

      search,

    );


  }








  @RequirePermission('permission:watch')
  @Get('groups')
  findAllGroups() {


    return this.permissionService.findAllGroups();


  }








  @RequirePermission('permission:delete')
  @Delete(':id')
  deletePermission(

    @Param('id')
    id:string,

  ) {


    return this.permissionService.deletePermission(
      id,
    );


  }


}