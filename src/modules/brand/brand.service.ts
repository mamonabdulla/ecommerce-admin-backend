import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOptionsWhere,
  ILike,
} from 'typeorm';

import { Brand } from './entities/brand.entity';
import { Media } from '../media/entities/media.entity';

import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandService {

  constructor(

    @InjectRepository(Brand)
    private readonly brandRepository:
      Repository<Brand>,

    @InjectRepository(Media)
    private readonly mediaRepository:
      Repository<Media>,

  ) {}



  async create(
    dto: CreateBrandDto,
  ) {

    const existingName =
      await this.brandRepository.findOne({

        where: {
          name: dto.name,
        },

      });

    if (existingName) {

      throw new ConflictException(
        'Brand name already exists',
      );

    }

    const existingSlug =
      await this.brandRepository.findOne({

        where: {
          slug: dto.slug,
        },

      });

    if (existingSlug) {

      throw new ConflictException(
        'Brand slug already exists',
      );

    }

    let logo: Media | null = null;

    if (dto.logoId) {

      logo =
        await this.mediaRepository.findOne({

          where: {
            id: dto.logoId,
          },

        });

      if (!logo) {

        throw new NotFoundException(
          'Logo not found',
        );

      }

    }

    const brand =
      this.brandRepository.create({

        name: dto.name,

        slug: dto.slug,

        logo,

        status:
          dto.status ?? true,

        description:
          dto.description ?? null,

      });

    return this.brandRepository.save(
      brand,
    );

  }



  async findAll(

    page = 1,

    limit = 10,

    search?: string,

    status?: boolean,

  ) {

    const where:
      FindOptionsWhere<Brand> = {};

    if (search) {

      where.name =
        ILike(`%${search}%`);

    }

    if (status !== undefined) {

      where.status = status;

    }

    const [data, total] =
      await this.brandRepository.findAndCount({

        where,

        relations: {

          logo: true,

        },

        order: {

          name: 'ASC',

        },

        skip:
          (page - 1) * limit,

        take:
          limit,

      });

    return {

      data,

      total,

      page,

      limit,

      totalPages:
        Math.ceil(total / limit),

    };

  }



  async findOne(
    id: string,
  ) {

    const brand =
      await this.brandRepository.findOne({

        where: {
          id,
        },

        relations: {

          logo: true,

        },

      });

    if (!brand) {

      throw new NotFoundException(
        'Brand not found',
      );

    }

    return brand;

  }



  async update(

    id: string,

    dto: UpdateBrandDto,

  ) {

    const brand =
      await this.findOne(id);

    if (dto.name) {

      const existing =
        await this.brandRepository.findOne({

          where: {
            name: dto.name,
          },

        });

      if (

        existing &&

        existing.id !== id

      ) {

        throw new ConflictException(
          'Brand name already exists',
        );

      }

    }

    if (dto.slug) {

      const existing =
        await this.brandRepository.findOne({

          where: {
            slug: dto.slug,
          },

        });

      if (

        existing &&

        existing.id !== id

      ) {

        throw new ConflictException(
          'Brand slug already exists',
        );

      }

    }

    if (dto.logoId !== undefined) {

      if (dto.logoId === null) {

        brand.logo = null;

      } else {

        const logo =
          await this.mediaRepository.findOne({

            where: {
              id: dto.logoId,
            },

          });

        if (!logo) {

          throw new NotFoundException(
            'Logo not found',
          );

        }

        brand.logo = logo;

      }

    }

    if (dto.name !== undefined) {

      brand.name = dto.name;

    }

    if (dto.slug !== undefined) {

      brand.slug = dto.slug;

    }

    if (dto.description !== undefined) {

      brand.description =
        dto.description;

    }

    if (dto.status !== undefined) {

      brand.status = dto.status;

    }

    return this.brandRepository.save(
      brand,
    );

  }



  async remove(
    id: string,
  ) {

    const brand =
      await this.findOne(id);

    // Product reference check
    // will be added
    // after Product module.

    await this.brandRepository.remove(
      brand,
    );

    return {

      message:
        'Brand deleted successfully',

    };

  }

}