import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateBrandDto {

  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsUUID()
  logoId?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsString()
  description?: string;

}