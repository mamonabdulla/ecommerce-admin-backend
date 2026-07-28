import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import {
  InjectRepository,
} from '@nestjs/typeorm';

import {
  Repository,
} from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UserService {


  constructor(

    @InjectRepository(User)
    private readonly userRepository:
      Repository<User>,


    @InjectRepository(Role)
    private readonly roleRepository:
      Repository<Role>,

  ) {}






  async create(
    data: CreateUserDto,
  ) {


    const existingUser =
      await this.userRepository.findOne({

        where: {
          email: data.email,
        },

      });



    if (existingUser) {

      throw new ConflictException(
        'Email already exists',
      );

    }





    const role =
      await this.roleRepository.findOne({

        where: {
          id: data.roleId,
        },

      });



    if (!role) {

      throw new NotFoundException(
        'Role not found',
      );

    }






    const hashedPassword =
      await bcrypt.hash(
        data.password,
        10,
      );





    const user =
      this.userRepository.create({

        name: data.name,

        email: data.email,

        password: hashedPassword,

        phone: data.phone,

        gender: data.gender,

        avatar: data.avatar,

        isActive:
          data.isActive ?? true,

        role,

      });





    const savedUser =
      await this.userRepository.save(
        user,
      );



    return this.removeSensitiveData(
      savedUser,
    );

  }









  async findAll() {


    const users =
      await this.userRepository.find({

        relations: {

          role: true,

        },

      });



    return users.map(
      user =>
        this.removeSensitiveData(user),
    );

  }









  async findOne(
    id: string,
  ) {


    const user =
      await this.userRepository.findOne({

        where: {
          id,
        },

        relations: {

          role: true,

        },

      });





    if (!user) {

      throw new NotFoundException(
        'User not found',
      );

    }





    return this.removeSensitiveData(
      user,
    );

  }









  async update(

    id: string,

    data: UpdateUserDto,

    currentUser: any,

  ) {


    const user =
      await this.userRepository.findOne({

        where: {
          id,
        },

        relations: {

          role: true,

        },

      });





    if (!user) {

      throw new NotFoundException(
        'User not found',
      );

    }







    // Prevent self modification
    if (
      currentUser &&
      currentUser.id === id
    ) {


      if (data.roleId) {

        throw new ForbiddenException(
          'You cannot change your own role',
        );

      }



      if (
        data.isActive === false
      ) {

        throw new ForbiddenException(
          'You cannot deactivate yourself',
        );

      }

    }








    if (data.email) {


      const existingUser =
        await this.userRepository.findOne({

          where: {

            email: data.email,

          },

        });





      if (
        existingUser &&
        existingUser.id !== id
      ) {

        throw new ConflictException(
          'Email already exists',
        );

      }



      user.email =
        data.email;

    }









    if (data.roleId) {


      const role =
        await this.roleRepository.findOne({

          where: {

            id: data.roleId,

          },

        });





      if (!role) {

        throw new NotFoundException(
          'Role not found',
        );

      }



      user.role =
        role;

    }









    if (data.password) {

      user.password =
        await bcrypt.hash(
          data.password,
          10,
        );

    }







    if (data.name !== undefined)
      user.name = data.name;


    if (data.phone !== undefined)
      user.phone = data.phone;


    if (data.gender !== undefined)
      user.gender = data.gender;


    if (data.avatar !== undefined)
      user.avatar = data.avatar;


    if (data.isActive !== undefined)
      user.isActive = data.isActive;







    const updatedUser =
      await this.userRepository.save(
        user,
      );





    return this.removeSensitiveData(
      updatedUser,
    );

  }









  async remove(

    id: string,

    currentUser: any,

  ) {


    const user =
      await this.userRepository.findOne({

        where: {

          id,

        },

        relations: {

          role: true,

        },

      });






    if (!user) {

      throw new NotFoundException(
        'User not found',
      );

    }








    // Prevent deleting yourself
    if (
      currentUser &&
      currentUser.id === id
    ) {

      throw new ForbiddenException(
        'You cannot delete yourself',
      );

    }







    // Prevent deleting system Admin
    if (
      user.role?.name === 'Admin'
    ) {

      throw new ForbiddenException(
        'Cannot delete Admin user',
      );

    }







    await this.userRepository.remove(
      user,
    );






    return {

      message:
        'User deleted successfully',

    };


  }









  private removeSensitiveData(
    user: User,
  ) {


    const {

      password,

      refreshTokenHash,

      refreshTokenExpiresAt,

      ...safeUser

    } = user;



    return safeUser;

  }


}