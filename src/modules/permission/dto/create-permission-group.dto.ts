import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ArrayMinSize,
} from 'class-validator';


export class CreatePermissionGroupDto {


  @IsString()
  @IsNotEmpty()
  name: string;



  @IsString()
  @IsOptional()
  description?: string;



  @IsArray()
  @ArrayMinSize(1)
  @IsString({
    each: true,
  })
  actions: string[];


}