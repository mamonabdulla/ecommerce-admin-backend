import {
  IsArray,
  IsOptional,
  IsString,
  ArrayMinSize,
} from 'class-validator';


export class UpdatePermissionGroupDto {


  @IsString()
  @IsOptional()
  name?: string;



  @IsString()
  @IsOptional()
  description?: string;



  @IsArray()
  @ArrayMinSize(1)
  @IsString({
    each:true,
  })
  @IsOptional()
  actions?: string[];


}