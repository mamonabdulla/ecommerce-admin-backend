import { DataSource } from 'typeorm';
import { config } from 'dotenv';

import { Permission } from '../modules/permission/entities/permission.entity';
import { PermissionGroup } from '../modules/permission/entities/permission-group.entity';

import { Role } from '../modules/role/entities/role.entity';
import { User } from '../modules/user/entities/user.entity';

import { Media } from '../modules/media/entities/media.entity';

import { Category } from '../modules/category/entities/category.entity';

import { Brand } from '../modules/brand/entities/brand.entity';

import { Attribute } from '../modules/attribute/entities/attribute.entity';
import { AttributeValue } from '../modules/attribute/entities/attribute-value.entity';

import { Product } from '../modules/product/entities/product.entity';

import { ProductMedia } from '../modules/product-media/entities/product-media.entity';

import { ProductVariant } from '../modules/product-variant/entities/product-variant.entity';
import { VariantAttributeValue } from '../modules/product-variant/entities/variant-attribute-value.entity';


config();


export default new DataSource({

  type: 'postgres',

  host: process.env.DATABASE_HOST,

  port: Number(process.env.DATABASE_PORT),

  username: process.env.DATABASE_USER,

  password: process.env.DATABASE_PASSWORD,

  database: process.env.DATABASE_NAME,


  entities: [

    Permission,

    PermissionGroup,

    Role,

    User,

    Media,

    Category,

    Brand,

    Attribute,

    AttributeValue,

    Product,

    ProductMedia,

    ProductVariant,

    VariantAttributeValue,

  ],


  migrations: [

    'src/database/migrations/*.ts',

  ],


  synchronize: false,

});