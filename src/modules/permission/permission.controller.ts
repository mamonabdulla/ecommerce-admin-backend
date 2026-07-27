import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { PermissionService } from './permission.service';

import { CreatePermissionGroupDto } from './dto/create-permission-group.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionGroupDto } from './dto/update-permission-group.dto';


@Controller('permission')
export class PermissionController {

  constructor(
    private readonly permissionService: PermissionService,
  ) {}



  @Post('groups')
  createGroup(
    @Body()
    createPermissionGroupDto: CreatePermissionGroupDto,
  ) {
    return this.permissionService.createGroup(
      createPermissionGroupDto,
    );
  }



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



  @Post()
  createPermission(
    @Body()
    createPermissionDto: CreatePermissionDto,
  ) {
    return this.permissionService.createPermission(
      createPermissionDto,
    );
  }



  @Get('groups')
  findAllGroups() {
    return this.permissionService.findAllGroups();
  }



  @Get()
  findAllPermissions() {
    return this.permissionService.findAllPermissions();
  }

}