import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';


import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RoleModule } from './modules/role/role.module';
import { MediaModule } from './modules/media/media.module';
import { CategoryModule } from './modules/category/category.module';


import { JwtAuthGuard } from './modules/auth/guards/jwt-auth/jwt-auth.guard';
import { PermissionGuard } from './modules/auth/guards/permission/permission.guard';
import { BrandModule } from './modules/brand/brand.module';
import { AttributeModule } from './modules/attribute/attribute.module';
import { ProductModule } from './modules/product/product.module';
import { ProductVariantModule } from './modules/product-variant/product-variant.module';
import { ProductMediaModule } from './modules/product-media/product-media.module';




@Module({

  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
    }),


    TypeOrmModule.forRootAsync({

      inject: [
        ConfigService,
      ],


      useFactory: (

        configService: ConfigService,

      ) => ({

        type: 'postgres',


        host:
          configService.get<string>(
            'DATABASE_HOST',
          ),


        port:
          Number(
            configService.get(
              'DATABASE_PORT',
            ),
          ),


        username:
          configService.get<string>(
            'DATABASE_USER',
          ),


        password:
          configService.get<string>(
            'DATABASE_PASSWORD',
          ),


        database:
          configService.get<string>(
            'DATABASE_NAME',
          ),


        autoLoadEntities: true,


        synchronize: false,

      }),

    }),


    AuthModule,

    UserModule,

    PermissionModule,

    RoleModule,

    MediaModule,

    CategoryModule,

    BrandModule,

    AttributeModule,

    ProductModule,

    ProductVariantModule,

    ProductMediaModule,

  ],



  providers: [

    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },


    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },

  ],

})
export class AppModule {}