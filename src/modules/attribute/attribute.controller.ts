import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';

import {
  AttributeService,
} from './attribute.service';

import {
  CreateAttributeDto,
} from './dto/create-attribute.dto';

import {
  UpdateAttributeDto,
} from './dto/update-attribute.dto';

import {
  CreateAttributeValueDto,
} from './dto/create-attribute-value.dto';

import {
  UpdateAttributeValueDto,
} from './dto/update-attribute-value.dto';



@Controller('attributes')
export class AttributeController {


  constructor(
    private readonly attributeService: AttributeService,
  ) {}





  @Post()
  create(
    @Body() dto: CreateAttributeDto,
  ){

    return this.attributeService.create(dto);

  }







  @Get()
  findAll(){

    return this.attributeService.findAll();

  }







  @Get(':id')
  findOne(
    @Param('id') id:string,
  ){

    return this.attributeService.findOne(id);

  }







  @Patch(':id')
  update(

    @Param('id') id:string,

    @Body() dto:UpdateAttributeDto,

  ){

    return this.attributeService.update(
      id,
      dto,
    );

  }







  @Delete(':id')
  remove(
    @Param('id') id:string,
  ){

    return this.attributeService.remove(id);

  }







  @Post(':id/values')
  addValue(

    @Param('id') id:string,

    @Body() dto:CreateAttributeValueDto,

  ){

    return this.attributeService.addValue(
      id,
      dto,
    );

  }







  @Patch('values/:valueId')
  updateValue(

    @Param('valueId') valueId:string,

    @Body() dto:UpdateAttributeValueDto,

  ){

    return this.attributeService.updateValue(
      valueId,
      dto,
    );

  }







  @Delete('values/:valueId')
  removeValue(

    @Param('valueId') valueId:string,

  ){

    return this.attributeService.removeValue(
      valueId,
    );

  }


}