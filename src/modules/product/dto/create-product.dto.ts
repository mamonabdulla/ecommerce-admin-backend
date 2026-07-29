import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsUUID,
  IsArray,
} from 'class-validator';



export class CreateProductDto {


  @IsString()
  @IsNotEmpty()
  name: string;



  @IsString()
  @IsNotEmpty()
  slug: string;



  @IsString()
  @IsNotEmpty()
  sku: string;



  @IsOptional()
  @IsString()
  shortDescription?: string;



  @IsOptional()
  @IsString()
  longDescription?: string;



  @IsOptional()
  @IsBoolean()
  hasVariants?: boolean;



  @IsOptional()
  @IsNumber()
  price?: number;



  @IsOptional()
  @IsNumber()
  salePrice?: number;



  @IsOptional()
  @IsNumber()
  stock?: number;



  @IsOptional()
  @IsString()
  stockStatus?: string;



  @IsOptional()
  @IsNumber()
  weight?: number;



  @IsOptional()
  @IsBoolean()
  isActive?: boolean;



  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;



  @IsOptional()
  @IsNumber()
  sortOrder?: number;



  @IsOptional()
  @IsUUID()
  brandId?: string;



  @IsOptional()
  @IsArray()
  @IsUUID('4', {
    each: true,
  })
  categoryIds?: string[];



  @IsOptional()
  @IsArray()
  @IsUUID('4', {
    each: true,
  })
  mediaIds?: string[];


}