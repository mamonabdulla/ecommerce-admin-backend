import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

import { Permission } from './entities/permission.entity';
import { PermissionGroup } from './entities/permission-group.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Permission,
      PermissionGroup,
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