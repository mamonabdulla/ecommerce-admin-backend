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



@Controller('role')
export class RoleController {


  constructor(
    private readonly roleService: RoleService,
  ) {}





  @Post()
  create(
    @Body()
    createRoleDto: CreateRoleDto,
  ) {

    return this.roleService.create(
      createRoleDto,
    );

  }







  @Get()
  findAll() {

    return this.roleService.findAll();

  }







  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {

    return this.roleService.findOne(
      id,
    );

  }







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