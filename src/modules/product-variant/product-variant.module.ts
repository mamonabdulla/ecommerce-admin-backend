import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductVariant } from './entities/product-variant.entity';
import { VariantAttributeValue } from './entities/variant-attribute-value.entity';

import { ProductVariantService } from './product-variant.service';
import { ProductVariantController } from './product-variant.controller';

import { Product } from '../product/entities/product.entity';
import { Media } from '../media/entities/media.entity';
import { AttributeValue } from '../attribute/entities/attribute-value.entity';



@Module({

  imports: [

    TypeOrmModule.forFeature([

      ProductVariant,

      VariantAttributeValue,

      Product,

      Media,

      AttributeValue,

    ]),

  ],


  controllers: [

    ProductVariantController,

  ],


  providers: [

    ProductVariantService,

  ],


  exports: [

    ProductVariantService,

  ],

})
export class ProductVariantModule {}