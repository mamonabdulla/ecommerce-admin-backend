import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import {
  Repository,
  In,
} from 'typeorm';


import { Role } from './entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';


import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';



@Injectable()
export class RoleService {


  constructor(

    @InjectRepository(Role)
    private readonly roleRepository:
      Repository<Role>,


    @InjectRepository(Permission)
    private readonly permissionRepository:
      Repository<Permission>,

  ) {}







  async create(
    createRoleDto: CreateRoleDto,
  ) {


    const {
      name,
      description,
      isActive,
      permissionIds,
    } = createRoleDto;




    const existingRole =
      await this.roleRepository.findOne({

        where: {
          name,
        },

      });



    if (existingRole) {

      throw new ConflictException(
        'Role already exists',
      );

    }





    const permissions =
      await this.permissionRepository.find({

        where: {
          id: In(permissionIds),
        },

      });





    if (
      permissions.length !== permissionIds.length
    ) {

      throw new NotFoundException(
        'One or more permissions not found',
      );

    }





    const role =
      this.roleRepository.create({

        name,

        description,

        isActive,

        permissions,

      });





    return this.roleRepository.save(
      role,
    );

  }









  async findAll() {


    return this.roleRepository.find({

      relations: {

        permissions: true,

      },

    });


  }









  async findOne(
    id: string,
  ) {


    const role =
      await this.roleRepository.findOne({

        where: {
          id,
        },


        relations: {

          permissions: true,

        },

      });





    if (!role) {

      throw new NotFoundException(
        'Role not found',
      );

    }




    return role;

  }









  async update(

    id: string,

    updateRoleDto: UpdateRoleDto,

  ) {


    const {

      name,

      description,

      isActive,

      permissionIds,

    } = updateRoleDto;





    const role =
      await this.roleRepository.findOne({

        where: {

          id,

        },

        relations: {

          permissions: true,

        },

      });





    if (!role) {

      throw new NotFoundException(
        'Role not found',
      );

    }







    if (name) {


      const existingRole =
        await this.roleRepository.findOne({

          where: {

            name,

          },

        });





      if (

        existingRole &&

        existingRole.id !== id

      ) {

        throw new ConflictException(
          'Role already exists',
        );

      }




      role.name = name;

    }







    if (description !== undefined) {

      role.description =
        description;

    }







    if (isActive !== undefined) {

      role.isActive =
        isActive;

    }







    if (permissionIds) {


      const permissions =
        await this.permissionRepository.find({

          where: {

            id: In(permissionIds),

          },

        });





      if (

        permissions.length !== permissionIds.length

      ) {

        throw new NotFoundException(
          'One or more permissions not found',
        );

      }




      role.permissions =
        permissions;

    }







    return this.roleRepository.save(
      role,
    );

  }









  async remove(

    id: string,

  ) {


    const role =
      await this.roleRepository.findOne({

        where: {

          id,

        },

      });





    if (!role) {

      throw new NotFoundException(
        'Role not found',
      );

    }







    if (role.name === 'Admin') {

      throw new ForbiddenException(
        'Cannot delete system role',
      );

    }







    await this.roleRepository.delete(
      id,
    );





    return {

      message:
        'Role deleted successfully',

    };


  }


}