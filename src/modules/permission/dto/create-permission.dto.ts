import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';


export class CreatePermissionDto {

  @IsString()
  @IsNotEmpty()
  name: string;


  @IsString()
  @IsOptional()
  description?: string;


  @IsUUID()
  @IsNotEmpty()
  groupId: string;

}