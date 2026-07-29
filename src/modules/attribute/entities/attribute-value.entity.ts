import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Attribute } from './attribute.entity';


@Entity('attribute_values')
export class AttributeValue {


  @PrimaryGeneratedColumn('uuid')
  id: string;



  @Column()
  value: string;



  @Column()
  slug: string;



  @Column({
    type: 'varchar',
    nullable: true,
  })
  referenceValue: string | null;



  @ManyToOne(
    () => Attribute,
    attribute => attribute.values,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  attribute: Attribute;



  @CreateDateColumn()
  createdAt: Date;



  @UpdateDateColumn()
  updatedAt: Date;


}