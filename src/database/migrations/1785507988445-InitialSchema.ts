import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1785507988445 implements MigrationInterface {
    name = 'InitialSchema1785507988445'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permission_groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, CONSTRAINT "UQ_4d923def23302dc5da192374bfc" UNIQUE ("name"), CONSTRAINT "PK_e6d3b6dc86109f8149c4d6c5400" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "groupId" uuid NOT NULL, CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE ("name"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone" character varying, "gender" character varying, "avatar" character varying, "isActive" boolean NOT NULL DEFAULT true, "refreshTokenHash" character varying, "refreshTokenExpiresAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "roleId" uuid NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "brands" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "status" boolean NOT NULL DEFAULT true, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "logoId" uuid, CONSTRAINT "UQ_96db6bbbaa6f23cad26871339b6" UNIQUE ("name"), CONSTRAINT "UQ_b15428f362be2200922952dc268" UNIQUE ("slug"), CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" text, "isActive" boolean NOT NULL DEFAULT true, "sortOrder" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "imageId" uuid, "parentId" uuid, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."attributes_type_enum" AS ENUM('dropdown', 'radio', 'checkbox', 'colour_swatch', 'image_swatch')`);
        await queryRunner.query(`CREATE TABLE "attributes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "type" "public"."attributes_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_89afb34fd1fdb2ceb1cea6c57df" UNIQUE ("name"), CONSTRAINT "UQ_8723dbad2f74effbdc23b056205" UNIQUE ("slug"), CONSTRAINT "PK_32216e2e61830211d3a5d7fa72c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "attribute_values" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying NOT NULL, "slug" character varying NOT NULL, "referenceValue" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "attributeId" uuid, CONSTRAINT "PK_3babf93d1842d73e7ba849c0160" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "variant_attribute_values" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "variantId" uuid, "attributeValueId" uuid, CONSTRAINT "PK_89f09282a54c230e281c6fbf606" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_variants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sku" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "salePrice" numeric(10,2), "stock" integer NOT NULL DEFAULT '0', "stockStatus" character varying NOT NULL DEFAULT 'in_stock', "lowStockThreshold" integer NOT NULL DEFAULT '5', "weight" numeric(10,2), "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "productId" uuid NOT NULL, CONSTRAINT "UQ_46f236f21640f9da218a063a866" UNIQUE ("sku"), CONSTRAINT "PK_281e3f2c55652d6a22c0aa59fd7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "sku" character varying NOT NULL, "shortDescription" text, "longDescription" text, "hasVariants" boolean NOT NULL DEFAULT false, "price" numeric(10,2), "salePrice" numeric(10,2), "stock" integer, "stockStatus" character varying, "weight" numeric(10,2), "isActive" boolean NOT NULL DEFAULT true, "isFeatured" boolean NOT NULL DEFAULT false, "sortOrder" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "brandId" uuid, CONSTRAINT "UQ_464f927ae360106b783ed0b4106" UNIQUE ("slug"), CONSTRAINT "UQ_c44ac33a05b144dd0d9ddcf9327" UNIQUE ("sku"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_media" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isThumbnail" boolean NOT NULL DEFAULT false, "isGallery" boolean NOT NULL DEFAULT false, "sortOrder" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "productId" uuid, "mediaId" uuid, CONSTRAINT "PK_09d4639de8082a32aa27f3ac9a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "media" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fileName" character varying NOT NULL, "storedPath" character varying NOT NULL, "publicUrl" character varying NOT NULL, "mimeType" character varying NOT NULL, "type" character varying NOT NULL, "size" bigint NOT NULL, "width" integer, "height" integer, "thumbnail" character varying, "title" character varying, "altText" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "uploadedById" uuid NOT NULL, CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_permissions" ("rolesId" uuid NOT NULL, "permissionsId" uuid NOT NULL, CONSTRAINT "PK_7931614007a93423204b4b73240" PRIMARY KEY ("rolesId", "permissionsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0cb93c5877d37e954e2aa59e52" ON "role_permissions"  ("rolesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d422dabc78ff74a8dab6583da0" ON "role_permissions"  ("permissionsId") `);
        await queryRunner.query(`CREATE TABLE "product_variants_media_media" ("productVariantsId" uuid NOT NULL, "mediaId" uuid NOT NULL, CONSTRAINT "PK_023e9dcad3b322f1a841bbb5c89" PRIMARY KEY ("productVariantsId", "mediaId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_205fde7c9d790be4c1036ce219" ON "product_variants_media_media"  ("productVariantsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5ba168ab3a5870add5d09c4b18" ON "product_variants_media_media"  ("mediaId") `);
        await queryRunner.query(`CREATE TABLE "products_categories_categories" ("productsId" uuid NOT NULL, "categoriesId" uuid NOT NULL, CONSTRAINT "PK_8fd95511a998d598ff66d500933" PRIMARY KEY ("productsId", "categoriesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_40e7da0284a5389344605de8da" ON "products_categories_categories"  ("productsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e1d833224b5be535323207473f" ON "products_categories_categories"  ("categoriesId") `);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "FK_0ce20ad956af3961df1ff12d0c5" FOREIGN KEY ("groupId") REFERENCES "permission_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "brands" ADD CONSTRAINT "FK_4d12d5b92dba9da1a38be16ede2" FOREIGN KEY ("logoId") REFERENCES "media"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_fcb2e05575ea73809a8ff82fa1d" FOREIGN KEY ("imageId") REFERENCES "media"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_9a6f051e66982b5f0318981bcaa" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attribute_values" ADD CONSTRAINT "FK_b8f8e1d9141248b538c9285574e" FOREIGN KEY ("attributeId") REFERENCES "attributes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "variant_attribute_values" ADD CONSTRAINT "FK_7c0b50714d82aca370fe83658e2" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "variant_attribute_values" ADD CONSTRAINT "FK_9509033b3943acc218512688943" FOREIGN KEY ("attributeValueId") REFERENCES "attribute_values"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_variants" ADD CONSTRAINT "FK_f515690c571a03400a9876600b5" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ea86d0c514c4ecbb5694cbf57df" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_media" ADD CONSTRAINT "FK_50e3945c6150d80b69b5f18515a" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_media" ADD CONSTRAINT "FK_7ea222c9c8d181257ff60b5cb53" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "media" ADD CONSTRAINT "FK_4974d31d47717ebefc8b613eb27" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_0cb93c5877d37e954e2aa59e52c" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_d422dabc78ff74a8dab6583da02" FOREIGN KEY ("permissionsId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_variants_media_media" ADD CONSTRAINT "FK_205fde7c9d790be4c1036ce2190" FOREIGN KEY ("productVariantsId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_variants_media_media" ADD CONSTRAINT "FK_5ba168ab3a5870add5d09c4b183" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "products_categories_categories" ADD CONSTRAINT "FK_40e7da0284a5389344605de8dab" FOREIGN KEY ("productsId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "products_categories_categories" ADD CONSTRAINT "FK_e1d833224b5be535323207473f1" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products_categories_categories" DROP CONSTRAINT "FK_e1d833224b5be535323207473f1"`);
        await queryRunner.query(`ALTER TABLE "products_categories_categories" DROP CONSTRAINT "FK_40e7da0284a5389344605de8dab"`);
        await queryRunner.query(`ALTER TABLE "product_variants_media_media" DROP CONSTRAINT "FK_5ba168ab3a5870add5d09c4b183"`);
        await queryRunner.query(`ALTER TABLE "product_variants_media_media" DROP CONSTRAINT "FK_205fde7c9d790be4c1036ce2190"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_d422dabc78ff74a8dab6583da02"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_0cb93c5877d37e954e2aa59e52c"`);
        await queryRunner.query(`ALTER TABLE "media" DROP CONSTRAINT "FK_4974d31d47717ebefc8b613eb27"`);
        await queryRunner.query(`ALTER TABLE "product_media" DROP CONSTRAINT "FK_7ea222c9c8d181257ff60b5cb53"`);
        await queryRunner.query(`ALTER TABLE "product_media" DROP CONSTRAINT "FK_50e3945c6150d80b69b5f18515a"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ea86d0c514c4ecbb5694cbf57df"`);
        await queryRunner.query(`ALTER TABLE "product_variants" DROP CONSTRAINT "FK_f515690c571a03400a9876600b5"`);
        await queryRunner.query(`ALTER TABLE "variant_attribute_values" DROP CONSTRAINT "FK_9509033b3943acc218512688943"`);
        await queryRunner.query(`ALTER TABLE "variant_attribute_values" DROP CONSTRAINT "FK_7c0b50714d82aca370fe83658e2"`);
        await queryRunner.query(`ALTER TABLE "attribute_values" DROP CONSTRAINT "FK_b8f8e1d9141248b538c9285574e"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_9a6f051e66982b5f0318981bcaa"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_fcb2e05575ea73809a8ff82fa1d"`);
        await queryRunner.query(`ALTER TABLE "brands" DROP CONSTRAINT "FK_4d12d5b92dba9da1a38be16ede2"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_0ce20ad956af3961df1ff12d0c5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e1d833224b5be535323207473f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_40e7da0284a5389344605de8da"`);
        await queryRunner.query(`DROP TABLE "products_categories_categories"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5ba168ab3a5870add5d09c4b18"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_205fde7c9d790be4c1036ce219"`);
        await queryRunner.query(`DROP TABLE "product_variants_media_media"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d422dabc78ff74a8dab6583da0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0cb93c5877d37e954e2aa59e52"`);
        await queryRunner.query(`DROP TABLE "role_permissions"`);
        await queryRunner.query(`DROP TABLE "media"`);
        await queryRunner.query(`DROP TABLE "product_media"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "product_variants"`);
        await queryRunner.query(`DROP TABLE "variant_attribute_values"`);
        await queryRunner.query(`DROP TABLE "attribute_values"`);
        await queryRunner.query(`DROP TABLE "attributes"`);
        await queryRunner.query(`DROP TYPE "public"."attributes_type_enum"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "brands"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP TABLE "permission_groups"`);
    }

}
