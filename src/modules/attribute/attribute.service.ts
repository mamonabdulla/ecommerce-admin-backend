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
} from 'typeorm';

import {
  Attribute,
} from './entities/attribute.entity';

import {
  AttributeValue,
} from './entities/attribute-value.entity';

import {
  CreateAttributeDto,
} from './dto/create-attribute.dto';

import {
  UpdateAttributeDto,
} from './dto/update-attribute.dto';

import {
  CreateAttributeValueDto,
} from './dto/create-attribute-value.dto';

import {
  UpdateAttributeValueDto,
} from './dto/update-attribute-value.dto';



@Injectable()
export class AttributeService {


  constructor(

    @InjectRepository(Attribute)
    private readonly attributeRepository:
      Repository<Attribute>,


    @InjectRepository(AttributeValue)
    private readonly valueRepository:
      Repository<AttributeValue>,

  ) {}







  async create(
    dto: CreateAttributeDto,
  ) {


    const existing =
      await this.attributeRepository.findOne({

        where:{
          slug: dto.slug,
        },

      });




    if(existing){

      throw new ConflictException(
        'Attribute slug already exists',
      );

    }





    const attribute =
      this.attributeRepository.create({

        name:
          dto.name,

        slug:
          dto.slug,

        type:
          dto.type,

      });





    const savedAttribute =
      await this.attributeRepository.save(
        attribute,
      );






    if(dto.values?.length){


      const values =
        dto.values.map(value =>

          this.valueRepository.create({

            value:
              value.value,

            slug:
              value.slug,

            referenceValue:
              value.referenceValue ?? null,

            attribute:
              savedAttribute,

          }),

        );




      await this.valueRepository.save(
        values,
      );


    }





    return this.findOne(
      savedAttribute.id,
    );


  }









  async findAll(){


    return this.attributeRepository.find({

      relations:{
        values:true,
      },

      order:{
        createdAt:'DESC',
      },

    });


  }









  async findOne(
    id:string,
  ){


    const attribute =
      await this.attributeRepository.findOne({

        where:{
          id,
        },

        relations:{
          values:true,
        },

      });





    if(!attribute){

      throw new NotFoundException(
        'Attribute not found',
      );

    }





    return attribute;


  }









  async update(

    id:string,

    dto:UpdateAttributeDto,

  ){


    const attribute =
      await this.findOne(id);





    if(dto.slug){


      const existing =
        await this.attributeRepository.findOne({

          where:{
            slug:dto.slug,
          },

        });





      if(
        existing &&
        existing.id !== id
      ){

        throw new ConflictException(
          'Attribute slug already exists',
        );

      }


    }





    Object.assign(
      attribute,
      dto,
    );





    return this.attributeRepository.save(
      attribute,
    );


  }









  async remove(
    id:string,
  ){


    const attribute =
      await this.findOne(id);





    await this.attributeRepository.remove(
      attribute,
    );





    return {

      message:
        'Attribute deleted successfully',

    };


  }









  async addValue(

    attributeId:string,

    dto:CreateAttributeValueDto,

  ){


    const attribute =
      await this.findOne(attributeId);





    const existing =
      await this.valueRepository.findOne({

        where:{

          slug:dto.slug,

          attribute:{
            id:attributeId,
          },

        },

        relations:{
          attribute:true,
        },

      });





    if(existing){

      throw new ConflictException(
        'Attribute value already exists',
      );

    }





    const value =
      this.valueRepository.create({

        value:
          dto.value,

        slug:
          dto.slug,

        referenceValue:
          dto.referenceValue ?? null,

        attribute,

      });





    return this.valueRepository.save(
      value,
    );


  }









  async updateValue(

    valueId:string,

    dto:UpdateAttributeValueDto,

  ){


    const value =
      await this.valueRepository.findOne({

        where:{
          id:valueId,
        },

      });





    if(!value){

      throw new NotFoundException(
        'Attribute value not found',
      );

    }





    Object.assign(
      value,
      dto,
    );





    return this.valueRepository.save(
      value,
    );


  }









  async removeValue(

    valueId:string,

  ){


    const value =
      await this.valueRepository.findOne({

        where:{
          id:valueId,
        },

      });





    if(!value){

      throw new NotFoundException(
        'Attribute value not found',
      );

    }





    await this.valueRepository.remove(
      value,
    );





    return {

      message:
        'Attribute value deleted successfully',

    };


  }


}