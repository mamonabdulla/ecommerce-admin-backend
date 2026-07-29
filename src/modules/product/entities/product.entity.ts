import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';


import { Brand } from '../../brand/entities/brand.entity';
import { Category } from '../../category/entities/category.entity';
import { ProductVariant } from '../../product-variant/entities/product-variant.entity';
import { ProductMedia } from '../../product-media/entities/product-media.entity';



@Entity('products')
export class Product {


  @PrimaryGeneratedColumn('uuid')
  id: string;



  @Column()
  name: string;



  @Column({
    unique: true,
  })
  slug: string;



  @Column({
    unique: true,
  })
  sku: string;



  @Column({
    type: 'text',
    nullable: true,
  })
  shortDescription: string | null;



  @Column({
    type: 'text',
    nullable: true,
  })
  longDescription: string | null;



  @Column({
    default: false,
  })
  hasVariants: boolean;



  // Simple product fields

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  price: number | null;



  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  salePrice: number | null;



  @Column({
    type: 'int',
    nullable: true,
  })
  stock: number | null;



  @Column({
    type: 'varchar',
    nullable: true,
  })
  stockStatus: string | null;



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



  @Column({
    default: false,
  })
  isFeatured: boolean;



  @Column({
    type: 'int',
    default: 0,
  })
  sortOrder: number;



  @ManyToOne(
    () => Brand,
    brand => brand.products,
    {
      nullable: true,
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn()
  brand: Brand;



  @ManyToMany(
    () => Category,
    category => category.products,
  )
  @JoinTable()
  categories: Category[];



  @OneToMany(
    () => ProductVariant,
    variant => variant.product,
  )
  variants: ProductVariant[];



  @OneToMany(
    () => ProductMedia,
    productMedia => productMedia.product,
  )
  productMedia: ProductMedia[];



  @CreateDateColumn()
  createdAt: Date;



  @UpdateDateColumn()
  updatedAt: Date;


}