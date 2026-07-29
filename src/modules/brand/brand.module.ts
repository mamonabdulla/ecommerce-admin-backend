import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';

import { Brand } from './entities/brand.entity';
import { Media } from '../media/entities/media.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Brand,
      Media,
    ]),
  ],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}