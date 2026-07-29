import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { AttributeValue } from './attribute-value.entity';


export enum AttributeType {
  DROPDOWN = 'dropdown',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  COLOUR_SWATCH = 'colour_swatch',
  IMAGE_SWATCH = 'image_swatch',
}


@Entity('attributes')
export class Attribute {


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
    type: 'enum',
    enum: AttributeType,
  })
  type: AttributeType;



  @OneToMany(
    () => AttributeValue,
    value => value.attribute,
    {
      cascade: true,
    },
  )
  values: AttributeValue[];



  @CreateDateColumn()
  createdAt: Date;



  @UpdateDateColumn()
  updatedAt: Date;


}