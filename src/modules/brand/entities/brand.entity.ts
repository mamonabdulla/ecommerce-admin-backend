import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Media } from '../../media/entities/media.entity';
import { Product } from '../../product/entities/product.entity';


@Entity('brands')
export class Brand {


  @PrimaryGeneratedColumn('uuid')
  id: string;



  @Column({
    unique: true,
  })
  name: string;



  @Column({
    unique: true,
  })
  slug: string;



  @ManyToOne(
    () => Media,
    {
      nullable: true,
    },
  )
  @JoinColumn()
  logo: Media | null;



  @Column({
    default: true,
  })
  status: boolean;



  @Column({
    type: 'text',
    nullable: true,
  })
  description: string | null;



  @OneToMany(
    () => Product,
    product => product.brand,
  )
  products: Product[];



  @CreateDateColumn()
  createdAt: Date;



  @UpdateDateColumn()
  updatedAt: Date;


}