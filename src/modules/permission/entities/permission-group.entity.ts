import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

import { Permission } from './permission.entity';

@Entity('permission_groups')
export class PermissionGroup {

  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column({ unique: true })
  name: string;


  @Column({
    nullable: true,
  })
  description: string;


  @OneToMany(
    () => Permission,
    permission => permission.group,
  )
  permissions: Permission[];
}