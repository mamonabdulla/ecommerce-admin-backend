import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './entities/category.entity';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { Media } from '../media/entities/media.entity';


@Injectable()
export class CategoryService {


  constructor(

    @InjectRepository(Category)
    private readonly categoryRepository:
      Repository<Category>,


    @InjectRepository(Media)
    private readonly mediaRepository:
      Repository<Media>,

  ) {}





  async create(
    dto: CreateCategoryDto,
  ) {


    const existingName =
      await this.categoryRepository.findOne({

        where:{
          name: dto.name,
        },

      });



    if(existingName){

      throw new ConflictException(
        'Category name already exists',
      );

    }




    const existingSlug =
      await this.categoryRepository.findOne({

        where:{
          slug: dto.slug,
        },

      });



    if(existingSlug){

      throw new ConflictException(
        'Category slug already exists',
      );

    }






    let image: Media | null = null;



    if(dto.imageId){


      image =
        await this.mediaRepository.findOne({

          where:{
            id: dto.imageId,
          },

        });



      if(!image){

        throw new NotFoundException(
          'Image not found',
        );

      }

    }





    let parent: Category | null = null;



    if(dto.parentId){


      parent =
        await this.categoryRepository.findOne({

          where:{
            id: dto.parentId,
          },

        });



      if(!parent){

        throw new NotFoundException(
          'Parent category not found',
        );

      }

    }





    const category =
      this.categoryRepository.create({

        name:
          dto.name,


        slug:
          dto.slug,


        description:
          dto.description ?? null,


        image,


        parent,


        isActive:
          dto.isActive ?? true,


        sortOrder:
          dto.sortOrder ?? 0,

      });





    return this.categoryRepository.save(
      category,
    );


  }








  async findAll(){


    const categories =
      await this.categoryRepository.find({

        relations:{

          image:true,

          parent:true,

        },


        order:{

          sortOrder:'ASC',

        },


      });





    const buildTree = (

      parentId: string | null = null,

    ): Category[] => {


      return categories

        .filter(

          category =>

            category.parent?.id === parentId ||

            (!category.parent && parentId === null),

        )


        .map(category => ({


          ...category,


          children:

            buildTree(category.id),


        }));


    };





    return buildTree();


  }








  async findOne(
    id:string,
  ){


    const category =
      await this.categoryRepository.findOne({

        where:{
          id,
        },


        relations:{

          image:true,

          parent:true,

        },

      });





    if(!category){

      throw new NotFoundException(
        'Category not found',
      );

    }





    return category;


  }








  async update(

    id:string,

    dto:UpdateCategoryDto,

  ){


    const category =
      await this.findOne(id);





    if(dto.name){


      const existingName =
        await this.categoryRepository.findOne({

          where:{
            name:dto.name,
          },

        });



      if(
        existingName &&
        existingName.id !== id
      ){

        throw new ConflictException(
          'Category name already exists',
        );

      }


    }








    if(dto.slug){


      const existing =
        await this.categoryRepository.findOne({

          where:{
            slug:dto.slug,
          },

        });





      if(
        existing &&
        existing.id !== id
      ){

        throw new ConflictException(
          'Category slug already exists',
        );

      }


    }








    if(dto.parentId){


      if(dto.parentId === id){

        throw new ConflictException(
          'Category cannot be its own parent',
        );

      }





      let parent =
        await this.categoryRepository.findOne({

          where:{
            id: dto.parentId,
          },


          relations:{

            parent:true,

          },

        });





      if(!parent){

        throw new NotFoundException(
          'Parent category not found',
        );

      }





      while(parent){


        if(parent.id === id){

          throw new ConflictException(
            'Category cannot be moved under its own child',
          );

        }


        parent =
          parent.parent;


      }


    }








    if(dto.parentId){


      const parent =
        await this.categoryRepository.findOne({

          where:{
            id:dto.parentId,
          },

        });


      category.parent = parent;


    }








    if(dto.imageId){


      const image =
        await this.mediaRepository.findOne({

          where:{
            id:dto.imageId,
          },

        });





      if(!image){

        throw new NotFoundException(
          'Image not found',
        );

      }




      category.image = image;


    }








    Object.assign(

      category,

      dto,

    );





    return this.categoryRepository.save(
      category,
    );


  }








  async remove(
    id:string,
  ){


    const category =
      await this.categoryRepository.findOne({

        where:{
          id,
        },


        relations:{

          children:true,

        },

      });





    if(!category){

      throw new NotFoundException(
        'Category not found',
      );

    }








    if(category.children.length > 0){


      throw new ConflictException(
        'Cannot delete category with child categories',
      );


    }








    await this.categoryRepository.remove(
      category,
    );





    return {

      message:
        'Category deleted successfully',

    };


  }


}