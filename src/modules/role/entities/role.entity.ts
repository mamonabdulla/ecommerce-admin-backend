import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

import { Permission } from '../../permission/entities/permission.entity';
import { User } from '../../user/entities/user.entity';

@Entity('roles')
export class Role {

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


  @Column({
    default: true,
  })
  isActive: boolean;


  @ManyToMany(
    () => Permission,
  )
  @JoinTable({
    name: 'role_permissions',
  })
  permissions: Permission[];


  @OneToMany(
    () => User,
    (user) => user.role,
  )
  users: User[];

}