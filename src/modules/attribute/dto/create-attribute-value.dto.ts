import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';



export class CreateAttributeValueDto {


  @IsString()
  @IsNotEmpty()
  value: string;



  @IsString()
  @IsNotEmpty()
  slug: string;



  @IsOptional()
  @IsString()
  referenceValue?: string;


}