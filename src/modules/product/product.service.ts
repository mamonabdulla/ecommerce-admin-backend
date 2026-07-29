import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';


import {
  InjectRepository,
} from '@nestjs/typeorm';


import {
  Repository,
  In,
} from 'typeorm';



import { Product } from './entities/product.entity';

import { Brand } from '../brand/entities/brand.entity';

import { Category } from '../category/entities/category.entity';

import { Media } from '../media/entities/media.entity';

import { ProductMedia } from '../product-media/entities/product-media.entity';



import { CreateProductDto } from './dto/create-product.dto';

import { UpdateProductDto } from './dto/update-product.dto';



@Injectable()
export class ProductService {


  constructor(


    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,


    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,


    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,


    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,


    @InjectRepository(ProductMedia)
    private readonly productMediaRepository: Repository<ProductMedia>,


  ) {}





  async create(
    createProductDto: CreateProductDto,
  ) {


    const {

      brandId,

      categoryIds,

      mediaIds,

      ...productData

    } = createProductDto;





    const product =
      this.productRepository.create(
        productData,
      );





    if (brandId) {


      const brand =
        await this.brandRepository.findOne({

          where: {
            id: brandId,
          },

        });



      if (!brand) {

        throw new NotFoundException(
          'Brand not found',
        );

      }



      product.brand = brand;

    }





    if (categoryIds?.length) {


      product.categories =
        await this.categoryRepository.find({

          where: {

            id: In(categoryIds),

          },

        });


    }





    const savedProduct =
      await this.productRepository.save(
        product,
      );






    if (mediaIds?.length) {


      const medias =
        await this.mediaRepository.find({

          where: {

            id: In(mediaIds),

          },

        });





      const productMedia =
        medias.map(

          (media) =>

            this.productMediaRepository.create({

              product: savedProduct,

              media,

            }),

        );



      await this.productMediaRepository.save(
        productMedia,
      );


    }





    return await this.findOne(
      savedProduct.id,
    );


  }








  async findAll() {


    return await this.productRepository.find({

      relations: {


        brand: true,


        categories: true,


        variants: {

          media: true,

          attributeValues: {

            attributeValue: {

              attribute: true,

            },

          },

        },


        productMedia: {

          media: true,

        },


      },


    });


  }








  async findOne(
    id: string,
  ) {


    const product =
      await this.productRepository.findOne({


        where: {

          id,

        },


        relations: {


          brand: true,


          categories: true,


          variants: {

            media: true,

            attributeValues: {

              attributeValue: {

                attribute: true,

              },

            },

          },


          productMedia: {

            media: true,

          },


        },


      });





    if (!product) {


      throw new NotFoundException(

        'Product not found',

      );


    }




    return product;


  }








  async update(

    id: string,

    updateProductDto: UpdateProductDto,

  ) {



    const product =
      await this.findOne(id);





    const {

      brandId,

      categoryIds,

      mediaIds,

      ...productData

    } = updateProductDto;





    Object.assign(

      product,

      productData,

    );






    if (brandId) {


      const brand =
        await this.brandRepository.findOne({

          where: {

            id: brandId,

          },

        });





      if (!brand) {

        throw new NotFoundException(
          'Brand not found',
        );

      }




      product.brand = brand;


    }







    if (categoryIds) {


      product.categories =
        await this.categoryRepository.find({

          where: {

            id: In(categoryIds),

          },

        });


    }







    if (mediaIds) {


      await this.productMediaRepository.delete({

        product: {

          id,

        },

      });





      const medias =
        await this.mediaRepository.find({

          where: {

            id: In(mediaIds),

          },

        });





      const productMedia =
        medias.map(

          (media) =>

            this.productMediaRepository.create({

              product,

              media,

            }),

        );





      await this.productMediaRepository.save(

        productMedia,

      );


    }







    return await this.findOne(id);


  }








  async remove(
    id: string,
  ) {


    const product =
      await this.findOne(id);





    return await this.productRepository.remove(

      product,

    );


  }



}