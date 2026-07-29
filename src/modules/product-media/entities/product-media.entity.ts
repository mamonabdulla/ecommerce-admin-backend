import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

import { Product } from '../../product/entities/product.entity';
import { Media } from '../../media/entities/media.entity';



@Entity('product_media')
export class ProductMedia {


  @PrimaryGeneratedColumn('uuid')
  id: string;



  @ManyToOne(
    () => Product,
    product => product.productMedia,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  product: Product;



  @ManyToOne(
    () => Media,
    {
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn()
  media: Media;



  @Column({
    default: false,
  })
  isThumbnail: boolean;



  @Column({
    default: false,
  })
  isGallery: boolean;



  @Column({
    default: 0,
  })
  sortOrder: number;



  @CreateDateColumn()
  createdAt: Date;



  @UpdateDateColumn()
  updatedAt: Date;


}