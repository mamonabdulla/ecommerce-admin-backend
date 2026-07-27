import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { Role } from '../../role/entities/role.entity';

@Entity('users')
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column()
  name: string;


  @Column({ unique: true })
  email: string;


  @Column()
  password: string;


  @Column({
    nullable: true,
  })
  phone: string;


  @Column({
    nullable: true,
  })
  gender: string;


  @Column({
    nullable: true,
  })
  avatar: string;


  @Column({
    default: true,
  })
  isActive: boolean;


  @Column({
    type: 'varchar',
    nullable: true,
  })
  refreshTokenHash: string | null;


  @ManyToOne(
    () => Role,
    (role) => role.users,
    {
      nullable: false,
      eager: true,
    },
  )
  role: Role;


  @CreateDateColumn()
  createdAt: Date;


  @UpdateDateColumn()
  updatedAt: Date;

}