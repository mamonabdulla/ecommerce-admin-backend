import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  IsUUID,
} from 'class-validator';

import {
  Type,
} from 'class-transformer';



export class CreateProductVariantDto {



  @IsUUID()
  productId: string;





  @IsString()
  sku: string;





  @Type(() => Number)
  @IsNumber()
  price: number;





  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  salePrice?: number | null;





  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  stock?: number;





  @IsOptional()
  @IsString()
  stockStatus?: string;





  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lowStockThreshold?: number;





  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  weight?: number | null;





  @IsOptional()
  @IsBoolean()
  isActive?: boolean;





  @IsOptional()
  @IsArray()
  @IsUUID('4', {
    each: true,
  })
  mediaIds?: string[];





  @IsOptional()
  @IsArray()
  @IsUUID('4', {
    each: true,
  })
  attributeValueIds?: string[];


}