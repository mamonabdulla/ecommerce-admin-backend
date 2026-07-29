import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';


import { User } from '../../user/entities/user.entity';
import { ProductMedia } from '../../product-media/entities/product-media.entity';



@Entity('media')
export class Media {


  @PrimaryGeneratedColumn('uuid')
  id: string;



  @Column()
  fileName: string;



  @Column()
  storedPath: string;



  @Column()
  publicUrl: string;



  @Column()
  mimeType: string;



  @Column()
  type: string;



  @Column('bigint')
  size: number;



  @Column({
    type: 'int',
    nullable: true,
  })
  width: number | null;



  @Column({
    type: 'int',
    nullable: true,
  })
  height: number | null;



  @Column({
    type: 'varchar',
    nullable: true,
  })
  thumbnail: string | null;



  @Column({
    type: 'varchar',
    nullable: true,
  })
  title: string | null;



  @Column({
    type: 'varchar',
    nullable: true,
  })
  altText: string | null;



  @ManyToOne(
    () => User,
    {
      nullable: false,
    },
  )
  uploadedBy: User;



  @OneToMany(
    () => ProductMedia,
    productMedia => productMedia.media,
  )
  productMedia: ProductMedia[];



  @CreateDateColumn()
  createdAt: Date;



  @UpdateDateColumn()
  updatedAt: Date;


}