import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';


import { ProductVariantService } from './product-variant.service';


import {
  CreateProductVariantDto,
} from './dto/create-product-variant.dto';


import {
  UpdateProductVariantDto,
} from './dto/update-product-variant.dto';



@Controller('product-variants')
export class ProductVariantController {


  constructor(
    private readonly variantService: ProductVariantService,
  ) {}





  @Post()
  create(

    @Body()
    dto: CreateProductVariantDto,

  ) {

    return this.variantService.create(
      dto,
    );

  }







  @Get()
  findAll() {

    return this.variantService.findAll();

  }







  @Get(':id')
  findOne(

    @Param('id')
    id: string,

  ) {

    return this.variantService.findOne(
      id,
    );

  }







  @Patch(':id')
  update(

    @Param('id')
    id: string,


    @Body()
    dto: UpdateProductVariantDto,

  ) {

    return this.variantService.update(
      id,
      dto,
    );

  }







  @Delete(':id')
  remove(

    @Param('id')
    id: string,

  ) {

    return this.variantService.remove(
      id,
    );

  }


}