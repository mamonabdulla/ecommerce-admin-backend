import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { ProductVariant } from './product-variant.entity';
import { AttributeValue } from '../../attribute/entities/attribute-value.entity';

@Entity('variant_attribute_values')
export class VariantAttributeValue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => ProductVariant,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  variant: ProductVariant;

  @ManyToOne(
    () => AttributeValue,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  attributeValue: AttributeValue;
}