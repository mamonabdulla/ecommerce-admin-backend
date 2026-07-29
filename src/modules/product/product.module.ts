import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';


import { Product } from './entities/product.entity';

import { Brand } from '../brand/entities/brand.entity';

import { Category } from '../category/entities/category.entity';

import { Media } from '../media/entities/media.entity';

import { ProductMedia } from '../product-media/entities/product-media.entity';



import { ProductService } from './product.service';

import { ProductController } from './product.controller';



@Module({

  imports: [

    TypeOrmModule.forFeature([

      Product,

      Brand,

      Category,

      Media,

      ProductMedia,

    ]),

  ],



  controllers: [

    ProductController,

  ],



  providers: [

    ProductService,

  ],



  exports: [

    ProductService,

  ],


})
export class ProductModule {}