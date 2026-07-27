import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';


export class CreateRoleDto {

  @IsString()
  name: string;


  @IsOptional()
  @IsString()
  description?: string;


  @IsOptional()
  @IsBoolean()
  isActive?: boolean;


  @IsArray()
  @IsUUID('4', {
    each: true,
  })
  permissionIds: string[];

}