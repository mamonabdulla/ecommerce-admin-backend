import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { PermissionGroup } from './permission-group.entity';

@Entity('permissions')
export class Permission {

  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column({
    unique: true,
  })
  name: string;


  @Column({
    nullable: true,
  })
  description: string;


  @ManyToOne(
    () => PermissionGroup,
    group => group.permissions,
    {
      onDelete: 'CASCADE',
    },
  )
  group: PermissionGroup;
}