import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { PermissionService } from './permission.service';

import { CreatePermissionGroupDto } from './dto/create-permission-group.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionGroupDto } from './dto/update-permission-group.dto';

import { RequirePermission } from '../../common/decorators/require-permission.decorator';

@Controller('permission')
export class PermissionController {
  constructor(
    private readonly permissionService: PermissionService,
  ) {}

  @RequirePermission('permission:create')
  @Post('groups')
  createGroup(
    @Body()
    createPermissionGroupDto: CreatePermissionGroupDto,
  ) {
    return this.permissionService.createGroup(
      createPermissionGroupDto,
    );
  }

  @RequirePermission('permission:update')
  @Patch('groups/:id')
  updateGroup(
    @Param('id')
    id: string,

    @Body()
    updatePermissionGroupDto: UpdatePermissionGroupDto,
  ) {
    return this.permissionService.updateGroup(
      id,
      updatePermissionGroupDto,
    );
  }

  @RequirePermission('permission:create')
  @Post()
  createPermission(
    @Body()
    createPermissionDto: CreatePermissionDto,
  ) {
    return this.permissionService.createPermission(
      createPermissionDto,
    );
  }

  @RequirePermission('permission:delete')
  @Delete(':id')
  deletePermission(
    @Param('id')
    id: string,
  ) {
    return this.permissionService.deletePermission(id);
  }

  @RequirePermission('permission:watch')
  @Get('groups')
  findAllGroups() {
    return this.permissionService.findAllGroups();
  }

  @RequirePermission('permission:read')
  @Get()
  findAllPermissions() {
    return this.permissionService.findAllPermissions();
  }
}