import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';


export class CreatePermissionGroupDto {

  @IsString()
  @IsNotEmpty()
  name: string;


  @IsString()
  @IsOptional()
  description?: string;


  @IsArray()
  @IsString({
    each: true,
  })
  actions: string[];

}