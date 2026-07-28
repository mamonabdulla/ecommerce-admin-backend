import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';

import type { Request } from 'express';

import { UserService } from './user.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { Permission } from '../../common/decorators/permission.decorator';



@Controller('users')
export class UserController {


  constructor(
    private readonly userService: UserService,
  ) {}







  @Post()
  @Permission('user:create')
  create(

    @Body()
    createUserDto: CreateUserDto,

  ) {

    return this.userService.create(
      createUserDto,
    );

  }









  @Get()
  @Permission('user:watch')
  findAll() {

    return this.userService.findAll();

  }









  @Get(':id')
  @Permission('user:read')
  findOne(

    @Param('id')
    id: string,

  ) {

    return this.userService.findOne(
      id,
    );

  }









  @Patch(':id')
  @Permission('user:update')
  update(

    @Param('id')
    id: string,


    @Body()
    updateUserDto: UpdateUserDto,


    @Req()
    req: Request,

  ) {

    return this.userService.update(

      id,

      updateUserDto,

      req.user,

    );

  }









  @Delete(':id')
  @Permission('user:delete')
  remove(

    @Param('id')
    id: string,


    @Req()
    req: Request,

  ) {

    return this.userService.remove(

      id,

      req.user,

    );

  }


}