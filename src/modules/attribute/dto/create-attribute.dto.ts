import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import {
  Type,
} from 'class-transformer';

import {
  AttributeType,
} from '../entities/attribute.entity';

import {
  CreateAttributeValueDto,
} from './create-attribute-value.dto';



export class CreateAttributeDto {


  @IsString()
  @IsNotEmpty()
  name: string;



  @IsString()
  @IsNotEmpty()
  slug: string;



  @IsEnum(AttributeType)
  type: AttributeType;



  @IsOptional()
  @ValidateNested({
    each: true,
  })
  @Type(() => CreateAttributeValueDto)
  values?: CreateAttributeValueDto[];


}