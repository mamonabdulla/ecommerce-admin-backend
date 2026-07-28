import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';


export class CreateUserDto {


  @IsString()
  @IsNotEmpty()
  name: string;



  @IsEmail()
  @IsNotEmpty()
  email: string;



  @IsString()
  @MinLength(6)
  password: string;



  @IsOptional()
  @IsString()
  phone?: string;



  @IsOptional()
  @IsString()
  gender?: string;



  @IsOptional()
  @IsString()
  avatar?: string;



  @IsUUID()
  @IsNotEmpty()
  roleId: string;



  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

}