import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  ParseFilePipeBuilder,
} from '@nestjs/common';

import {
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';

import type { Request } from 'express';

import { MediaService } from './media.service';

import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

import { Permission } from '../../common/decorators/permission.decorator';



interface AuthRequest extends Request {

  user: {

    id: string;

    role: string;

  };

}



@Controller('media')
export class MediaController {


  constructor(
    private readonly mediaService: MediaService,
  ) {}





  @Post('upload')
  @Permission('media:upload')
  @UseInterceptors(

    FileInterceptor('file', {

      limits: {

        fileSize:
          5 * 1024 * 1024,

      },

    }),

  )
  upload(

    @UploadedFile(

      new ParseFilePipeBuilder()

        .addFileTypeValidator({

          fileType:
            /(jpg|jpeg|png|webp)$/i,

        })

        .addMaxSizeValidator({

          maxSize:
            5 * 1024 * 1024,

        })

        .build(),

    )

    file: Express.Multer.File,


    @Body()
    dto: CreateMediaDto,


    @Req()
    req: AuthRequest,


  ) {


    return this.mediaService.upload(

      file,

      dto,

      req.user.id,

    );


  }









  @Post('upload-multiple')
  @Permission('media:upload')
  @UseInterceptors(

    FilesInterceptor(

      'files',

      10,

      {

        limits: {

          fileSize:
            5 * 1024 * 1024,

        },

      },

    ),

  )
  uploadMultiple(


    @UploadedFiles(

      new ParseFilePipeBuilder()

        .addFileTypeValidator({

          fileType:
            /(jpg|jpeg|png|webp)$/i,

        })

        .addMaxSizeValidator({

          maxSize:
            5 * 1024 * 1024,

        })

        .build(),

    )

    files: Express.Multer.File[],


    @Body()
    dto: CreateMediaDto,


    @Req()
    req: AuthRequest,


  ) {


    return this.mediaService.uploadMultiple(

      files,

      dto,

      req.user.id,

    );


  }









  @Get()
  @Permission('media:watch')
  findAll(

    @Query('page')
    page?: number,


    @Query('limit')
    limit?: number,


    @Query('search')
    search?: string,


    @Query('type')
    type?: string,


  ) {


    return this.mediaService.findAll(

      Number(page) || 1,

      Number(limit) || 10,

      search,

      type,

    );


  }









  @Get(':id')
  @Permission('media:read')
  findOne(

    @Param('id')
    id: string,

  ) {


    return this.mediaService.findOne(

      id,

    );


  }









  @Patch(':id')
  @Permission('media:update')
  update(

    @Param('id')
    id: string,


    @Body()
    dto: UpdateMediaDto,


  ) {


    return this.mediaService.update(

      id,

      dto,

    );


  }









  @Delete(':id')
  @Permission('media:delete')
  remove(

    @Param('id')
    id: string,


  ) {


    return this.mediaService.remove(

      id,

    );


  }


}