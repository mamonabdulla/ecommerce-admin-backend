import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinColumn,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Product } from '../../product/entities/product.entity';
import { Media } from '../../media/entities/media.entity';
import { VariantAttributeValue } from './variant-attribute-value.entity';

@Entity('product_variants')
export class ProductVariant {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  sku: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  salePrice: number | null;

  @Column({
    type: 'int',
    default: 0,
  })
  stock: number;

  @Column({
    type: 'varchar',
    default: 'in_stock',
  })
  stockStatus: string;

  @Column({
    type: 'int',
    default: 5,
  })
  lowStockThreshold: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  weight: number | null;

  @Column({
    default: true,
  })
  isActive: boolean;

  @ManyToOne(
    () => Product,
    product => product.variants,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  product: Product;

  @ManyToMany(
    () => Media,
  )
  @JoinTable()
  media: Media[];

  @OneToMany(
    () => VariantAttributeValue,
    variantAttributeValue => variantAttributeValue.variant,
    {
      cascade: true,
    },
  )
  attributeValues: VariantAttributeValue[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}