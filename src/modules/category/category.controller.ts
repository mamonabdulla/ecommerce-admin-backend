import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';


import { CategoryService } from './category.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';


import { Permission } from '../../common/decorators/permission.decorator';



@Controller('categories')
export class CategoryController {


  constructor(
    private readonly categoryService: CategoryService,
  ) {}



  @Post()
  @Permission('category:create')
  create(
    @Body()
    dto: CreateCategoryDto,
  ) {

    return this.categoryService.create(
      dto,
    );

  }




  @Get()
  @Permission('category:watch')
  findAll() {

    return this.categoryService.findAll();

  }





  @Get(':id')
  @Permission('category:read')
  findOne(
    @Param('id')
    id: string,
  ) {

    return this.categoryService.findOne(
      id,
    );

  }





  @Patch(':id')
  @Permission('category:update')
  update(

    @Param('id')
    id: string,


    @Body()
    dto: UpdateCategoryDto,

  ) {

    return this.categoryService.update(
      id,
      dto,
    );

  }





  @Delete(':id')
  @Permission('category:delete')
  remove(

    @Param('id')
    id: string,

  ) {

    return this.categoryService.remove(
      id,
    );

  }


}