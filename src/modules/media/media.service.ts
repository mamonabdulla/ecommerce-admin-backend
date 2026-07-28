import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

import sharp from 'sharp';
import { fileTypeFromBuffer } from 'file-type';


import { Media } from './entities/media.entity';
import { User } from '../user/entities/user.entity';

import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';



@Injectable()
export class MediaService {


  constructor(

    @InjectRepository(Media)
    private readonly mediaRepository:
      Repository<Media>,


    @InjectRepository(User)
    private readonly userRepository:
      Repository<User>,


  ) {}





  async upload(

    file: Express.Multer.File,

    dto: CreateMediaDto,

    userId: string,

  ) {


    if (!file) {

      throw new BadRequestException(
        'File is required',
      );

    }



    const user =
      await this.userRepository.findOne({

        where:{
          id:userId,
        },

      });



    if(!user){

      throw new NotFoundException(
        'User not found',
      );

    }




    try {


      const detected =
        await fileTypeFromBuffer(
          file.buffer,
        );



      if(!detected){

        throw new BadRequestException(
          'Invalid image file',
        );

      }




      const allowedTypes = [

        'image/jpeg',
        'image/png',
        'image/webp',

      ];



      if(
        !allowedTypes.includes(
          detected.mime,
        )
      ){

        throw new BadRequestException(
          'Only jpeg, png and webp allowed',
        );

      }





      if(
        file.size >
        5 * 1024 * 1024
      ){

        throw new BadRequestException(
          'Maximum size is 5MB',
        );

      }






      const mediaFolder =
        path.join(
          process.cwd(),
          'uploads',
          'media',
        );



      const thumbnailFolder =
        path.join(
          process.cwd(),
          'uploads',
          'thumbnails',
        );





      fs.mkdirSync(
        mediaFolder,
        {
          recursive:true,
        },
      );


      fs.mkdirSync(
        thumbnailFolder,
        {
          recursive:true,
        },
      );





      const fileName =
        `${randomUUID()}-${file.originalname}`;



      const filePath =
        path.join(
          mediaFolder,
          fileName,
        );





      await fs.promises.writeFile(

        filePath,

        file.buffer,

      );







      const metadata =
        await sharp(file.buffer)
        .metadata();





      const thumbnailName =
  `thumb-${path.parse(fileName).name}.jpg`;





      await sharp(file.buffer)

        .resize(
          300,
          300,
          {
            fit:'inside',
          },
        )

        .jpeg({
          quality:80,
        })

        .toFile(

          path.join(
            thumbnailFolder,
            thumbnailName,
          ),

        );







      const media =
        this.mediaRepository.create({


          fileName:
            file.originalname,


          storedPath:
            filePath.replace(
              /\\/g,
              '/',
            ),



          publicUrl:
            `/uploads/media/${fileName}`,



          mimeType:
            detected.mime,



          type:
            'image',



          size:
            file.size,



          width:
            metadata.width ?? null,


          height:
            metadata.height ?? null,



          thumbnail:
            `/uploads/thumbnails/${thumbnailName}`,



          title:
            dto.title ?? null,


          altText:
            dto.altText ?? null,



          uploadedBy:
            user,


        });






      return await this.mediaRepository.save(
        media,
      );



    }

    catch(error){



      if(
        error instanceof BadRequestException
      ){

        throw error;

      }




      throw new BadRequestException(
        error.message ||
        'Invalid image upload',
      );


    }


  }






  async uploadMultiple(

    files: Express.Multer.File[],

    dto:CreateMediaDto,

    userId:string,

  ){


    if(
      !files ||
      files.length===0
    ){

      throw new BadRequestException(
        'Files required',
      );

    }




    const uploaded:Media[]=[];



    for(const file of files){


      const media =
        await this.upload(
          file,
          dto,
          userId,
        );


      uploaded.push(media);

    }



    return uploaded;

  }







  async findAll(

    page=1,

    limit=10,

    search?:string,

    type?:string,

  ){


    const query =
      this.mediaRepository
      .createQueryBuilder('media')
      .leftJoinAndSelect(
        'media.uploadedBy',
        'uploadedBy',
      );




    if(search){

      query.andWhere(

        '(media.fileName ILIKE :search OR media.title ILIKE :search)',

        {
          search:`%${search}%`,
        },

      );

    }





    if(type){

      query.andWhere(
        'media.type=:type',
        {
          type,
        },
      );

    }





    query
    .skip(
      (page-1)*limit,
    )
    .take(limit)
    .orderBy(
      'media.createdAt',
      'DESC',
    );




    const [data,total] =
      await query.getManyAndCount();




    return {

      data,

      total,

      page,

      limit,

    };


  }







  async findOne(id:string){


    const media =
      await this.mediaRepository.findOne({

        where:{
          id,
        },

      });



    if(!media){

      throw new NotFoundException(
        'Media not found',
      );

    }



    return media;


  }








  async update(

    id:string,

    dto:UpdateMediaDto,

  ){


    const media =
      await this.findOne(id);



    Object.assign(
      media,
      dto,
    );



    return this.mediaRepository.save(
      media,
    );


  }








  async remove(id:string){


    const media =
      await this.findOne(id);



    if(
      fs.existsSync(
        media.storedPath,
      )
    ){

      fs.unlinkSync(
        media.storedPath,
      );

    }




    if(media.thumbnail){

      const thumbnailPath =
        path.join(
          process.cwd(),
          media.thumbnail,
        );


      if(
        fs.existsSync(
          thumbnailPath,
        )
      ){

        fs.unlinkSync(
          thumbnailPath,
        );

      }

    }




    await this.mediaRepository.remove(
      media,
    );



    return {

      message:
        'Media deleted successfully',

    };


  }


}