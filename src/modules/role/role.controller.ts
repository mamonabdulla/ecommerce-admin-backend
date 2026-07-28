import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';

import { RequirePermission } from '../../common/decorators/require-permission.decorator';

@Controller('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
  ) {}

  @RequirePermission('role:create')
  @Post()
  create(
    @Body()
    createRoleDto: CreateRoleDto,
  ) {
    return this.roleService.create(
      createRoleDto,
    );
  }

  @RequirePermission('role:watch')
  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @RequirePermission('role:read')
  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.roleService.findOne(
      id,
    );
  }

  @RequirePermission('role:delete')
  @Delete(':id')
  remove(
    @Param('id')
    id: string,
  ) {
    return this.roleService.remove(
      id,
    );
  }
}