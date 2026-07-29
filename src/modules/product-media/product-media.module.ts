import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { ProductMedia } from './entities/product-media.entity';
import { ProductMediaService } from './product-media.service';
import { ProductMediaController } from './product-media.controller';



@Module({

  imports: [
    TypeOrmModule.forFeature([
      ProductMedia,
    ]),
  ],


  providers: [
    ProductMediaService,
  ],


  controllers: [
    ProductMediaController,
  ],


  exports: [
    ProductMediaService,
  ],

})
export class ProductMediaModule {}