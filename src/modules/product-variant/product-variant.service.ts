import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import {
  InjectRepository,
} from '@nestjs/typeorm';

import {
  Repository,
  In,
} from 'typeorm';


import { ProductVariant } from './entities/product-variant.entity';
import { VariantAttributeValue } from './entities/variant-attribute-value.entity';

import { Product } from '../product/entities/product.entity';
import { Media } from '../media/entities/media.entity';
import { AttributeValue } from '../attribute/entities/attribute-value.entity';


import {
  CreateProductVariantDto,
} from './dto/create-product-variant.dto';


import {
  UpdateProductVariantDto,
} from './dto/update-product-variant.dto';




@Injectable()
export class ProductVariantService {


  constructor(


    @InjectRepository(ProductVariant)
    private readonly variantRepository:
      Repository<ProductVariant>,


    @InjectRepository(VariantAttributeValue)
    private readonly variantAttributeRepository:
      Repository<VariantAttributeValue>,


    @InjectRepository(AttributeValue)
    private readonly attributeValueRepository:
      Repository<AttributeValue>,


    @InjectRepository(Product)
    private readonly productRepository:
      Repository<Product>,


    @InjectRepository(Media)
    private readonly mediaRepository:
      Repository<Media>,


  ) {}





  async create(

    dto: CreateProductVariantDto,

  ) {


    const {

      productId,

      mediaIds,

      attributeValueIds,

      ...variantData

    } = dto;





    const existingVariant =
      await this.variantRepository.findOne({

        where: {

          sku: dto.sku,

        },

      });





    if (existingVariant) {

      throw new ConflictException(
        'Variant SKU already exists',
      );

    }





    const product =
      await this.productRepository.findOne({

        where: {

          id: productId,

        },

      });





    if (!product) {

      throw new NotFoundException(
        'Product not found',
      );

    }





    const variant =
      new ProductVariant();


    Object.assign(

      variant,

      variantData,

    );


    variant.product = product;





    if (mediaIds?.length) {


      variant.media =
        await this.mediaRepository.find({

          where: {

            id: In(mediaIds),

          },

        });


    }





    const savedVariant =
      await this.variantRepository.save(

        variant,

      );





    if (attributeValueIds?.length) {


      const attributeValues =
        await this.attributeValueRepository.find({

          where: {

            id: In(attributeValueIds),

          },

        });





    if (
      attributeValues.length !== attributeValueIds.length
    ) {

      throw new NotFoundException(
        'One or more attribute values not found',
      );

    }

          const variantAttributeValues =
        attributeValues.map(

          value =>

            this.variantAttributeRepository.create({

              variant: savedVariant,

              attributeValue: value,

            }),

        );





      await this.variantAttributeRepository.save(

        variantAttributeValues,

      );


    }





    return this.findOne(

      savedVariant.id,

    );


  }









  async findAll() {


    return this.variantRepository.find({

      relations: {

        product: true,

        media: true,

        attributeValues: {

          attributeValue: {

            attribute: true,

          },

        },

      },

    });


  }









  async findOne(

    id: string,

  ) {


    const variant =
      await this.variantRepository.findOne({

        where: {

          id,

        },


        relations: {

          product: true,

          media: true,

          attributeValues: {

            attributeValue: {

              attribute: true,

            },

          },

        },

      });





    if (!variant) {

      throw new NotFoundException(
        'Variant not found',
      );

    }





    return variant;


  }









  async update(

    id: string,

    dto: UpdateProductVariantDto,

  ) {


    const variant =
      await this.findOne(id);





    const {

      mediaIds,

      attributeValueIds,

      ...variantData

    } = dto;





    if (dto.sku) {


      const existingVariant =
        await this.variantRepository.findOne({

          where: {

            sku: dto.sku,

          },

        });





      if (

        existingVariant &&

        existingVariant.id !== id

      ) {

        throw new ConflictException(
          'Variant SKU already exists',
        );

      }


    }





    Object.assign(

      variant,

      variantData,

    );





    if (mediaIds) {


      variant.media =
        await this.mediaRepository.find({

          where: {

            id: In(mediaIds),

          },

        });


    }





    if (attributeValueIds) {


      await this.variantAttributeRepository.delete({

        variant: {

          id,

        },

      });





      const attributeValues =
        await this.attributeValueRepository.find({

          where: {

            id: In(attributeValueIds),

          },

        });





      if (

        attributeValues.length !== attributeValueIds.length

      ) {

        throw new NotFoundException(
          'One or more attribute values not found',
        );

      }





      const variantAttributeValues =
        attributeValues.map(

          value =>

            this.variantAttributeRepository.create({

              variant,

              attributeValue: value,

            }),

        );





      await this.variantAttributeRepository.save(

        variantAttributeValues,

      );


    }







    await this.variantRepository.save(

      variant,

    );





    return this.findOne(

      id,

    );


  }









  async remove(

    id: string,

  ) {


    const variant =
      await this.findOne(id);





    return this.variantRepository.remove(

      variant,

    );


  }


}