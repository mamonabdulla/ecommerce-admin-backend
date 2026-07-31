import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import {
  ValidationPipe,
} from '@nestjs/common';

import {
  SwaggerModule,
  DocumentBuilder,
} from '@nestjs/swagger';

import {
  NestExpressApplication,
} from '@nestjs/platform-express';

import { join } from 'path';



async function bootstrap() {


  const app =
    await NestFactory.create<NestExpressApplication>(
      AppModule,
    );



  app.enableCors({

    origin:
      process.env.FRONTEND_URL || 'http://localhost:3001',

    methods:
      [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'OPTIONS',
      ],

    allowedHeaders:
      [
        'Content-Type',
        'Authorization',
      ],

  });





  app.useGlobalPipes(

    new ValidationPipe({

      whitelist: true,

      transform: true,

    }),

  );





  app.useStaticAssets(

    join(__dirname, '..', 'uploads'),

    {

      prefix: '/uploads/',

    },

  );






  const config =

    new DocumentBuilder()

      .setTitle(

        'E-commerce Admin API',

      )

      .setDescription(

        'Admin backend API documentation',

      )

      .setVersion(

        '1.0',

      )

      .addBearerAuth(

        {

          type: 'http',

          scheme: 'bearer',

          bearerFormat: 'JWT',

        },

        'access-token',

      )

      .build();






  const document =

    SwaggerModule.createDocument(

      app,

      config,

    );






  SwaggerModule.setup(

    'api',

    app,

    document,

    {

      swaggerOptions: {

        persistAuthorization: true,

      },

    },

  );






  await app.listen(

    process.env.PORT || 3000,

  );

}



bootstrap();