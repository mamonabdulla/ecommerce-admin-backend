import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';

import { BrandService } from './brand.service';

import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

import { Permission } from '../../common/decorators/permission.decorator';

@Controller('brands')
export class BrandController {

  constructor(
    private readonly brandService: BrandService,
  ) {}



  @Post()
  @Permission('brand:create')
  create(
    @Body()
    dto: CreateBrandDto,
  ) {

    return this.brandService.create(
      dto,
    );

  }



  @Get()
  @Permission('brand:watch')
  findAll(

    @Query('page')
    page?: number,

    @Query('limit')
    limit?: number,

    @Query('search')
    search?: string,

    @Query('status')
    status?: string,

  ) {

    return this.brandService.findAll(

      page ? Number(page) : 1,

      limit ? Number(limit) : 10,

      search,

      status === undefined
        ? undefined
        : status === 'true',

    );

  }



  @Get(':id')
  @Permission('brand:read')
  findOne(

    @Param('id')
    id: string,

  ) {

    return this.brandService.findOne(
      id,
    );

  }



  @Patch(':id')
  @Permission('brand:update')
  update(

    @Param('id')
    id: string,

    @Body()
    dto: UpdateBrandDto,

  ) {

    return this.brandService.update(

      id,

      dto,

    );

  }



  @Delete(':id')
  @Permission('brand:delete')
  remove(

    @Param('id')
    id: string,

  ) {

    return this.brandService.remove(
      id,
    );

  }

}