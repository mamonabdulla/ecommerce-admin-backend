import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

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
  @Permission('user:read')
  findAll() {

    return this.userService.findAll();

  }





  @Patch(':id')
  @Permission('user:update')
  update(

    @Param('id')
    id: string,

    @Body()
    updateUserDto: UpdateUserDto,

  ) {

    return this.userService.update(
      id,
      updateUserDto,
    );

  }





  @Delete(':id')
  @Permission('user:delete')
  remove(

    @Param('id')
    id: string,

  ) {

    return this.userService.remove(
      id,
    );

  }


}