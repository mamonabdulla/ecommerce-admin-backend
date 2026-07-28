import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { Media } from '../../media/entities/media.entity';


@Entity('categories')
export class Category {


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


  @Column({
    type: 'text',
    nullable: true,
  })
  description: string | null;


  // Category image from media library
  @ManyToOne(
    () => Media,
    {
      nullable: true,
    },
  )
  @JoinColumn()
  image: Media | null;



  // Parent category (self relation)
  @ManyToOne(
    () => Category,
    category => category.children,
    {
      nullable: true,
      onDelete: 'SET NULL',
    },
  )
  parent: Category | null;



  // Child categories
  @OneToMany(
    () => Category,
    category => category.parent,
  )
  children: Category[];



  @Column({
    default: true,
  })
  isActive: boolean;



  @Column({
    default: 0,
  })
  sortOrder: number;



  @CreateDateColumn()
  createdAt: Date;


  @UpdateDateColumn()
  updatedAt: Date;

}