import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

import { Permission } from './entities/permission.entity';
import { PermissionGroup } from './entities/permission-group.entity';

import { Role } from '../role/entities/role.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Permission,
      PermissionGroup,
      Role,
    ]),
  ],

  controllers: [
    PermissionController,
  ],

  providers: [
    PermissionService,
  ],

  exports: [
    PermissionService,
  ],
})
export class PermissionModule {}