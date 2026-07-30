import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Permission } from './entities/permission.entity';
import { PermissionGroup } from './entities/permission-group.entity';
import { Role } from '../role/entities/role.entity';

import { CreatePermissionGroupDto } from './dto/create-permission-group.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionGroupDto } from './dto/update-permission-group.dto';


@Injectable()
export class PermissionService {


  constructor(

    @InjectRepository(Permission)
    private readonly permissionRepository:
      Repository<Permission>,


    @InjectRepository(PermissionGroup)
    private readonly permissionGroupRepository:
      Repository<PermissionGroup>,


    @InjectRepository(Role)
    private readonly roleRepository:
      Repository<Role>,

  ) {}





  private normalize(value: string) {

    return value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_');

  }







  async createGroup(
    dto: CreatePermissionGroupDto,
  ) {


    const groupName =
      this.normalize(dto.name);



    const existing =
      await this.permissionGroupRepository.findOne({

        where: {
          name: dto.name,
        },

      });



    if (existing) {

      throw new ConflictException(
        'Permission group already exists',
      );

    }





    return this.permissionGroupRepository.manager.transaction(

      async manager => {


        const group =
          manager.create(
            PermissionGroup,
            {
              name: dto.name,
              description: dto.description,
            },
          );



        const savedGroup =
          await manager.save(group);




        const permissions =
          dto.actions.map(action =>

            manager.create(
              Permission,
              {

                name:
                  `${groupName}:${this.normalize(action)}`,


                description:
                  `${action} permission for ${dto.name}`,


                group: savedGroup,

              },
            ),

          );



        await manager.save(
          Permission,
          permissions,
        );



        return manager.findOne(
          PermissionGroup,
          {

            where: {
              id: savedGroup.id,
            },

            relations: {
              permissions: true,
            },

          },
        );


      },

    );

  }









  async createPermission(
    dto: CreatePermissionDto,
  ) {


    const group =
      await this.permissionGroupRepository.findOne({

        where: {
          id: dto.groupId,
        },

      });



    if (!group) {

      throw new NotFoundException(
        'Permission group not found',
      );

    }




    const permissionName =
      this.normalizePermissionName(
        dto.name,
      );



    const exists =
      await this.permissionRepository.findOne({

        where: {
          name: permissionName,
        },

      });



    if (exists) {

      throw new ConflictException(
        'Permission already exists',
      );

    }




    const permission =
      this.permissionRepository.create({

        name:
          permissionName,

        description:
          dto.description,

        group,

      });



    const savedPermission =
      await this.permissionRepository.save(
        permission,
      );





    // Automatically add new permission to Super Admin

    const superAdmin =
      await this.roleRepository.findOne({

        where: {
          name: 'Super Admin',
        },

        relations: {
          permissions: true,
        },

      });



    if (superAdmin) {


      superAdmin.permissions.push(
        savedPermission,
      );


      await this.roleRepository.save(
        superAdmin,
      );


    }





    return savedPermission;

  }









  async updateGroup(
    id: string,
    dto: UpdatePermissionGroupDto,
  ) {


    const group =
      await this.permissionGroupRepository.findOne({

        where: {
          id,
        },

        relations: {
          permissions: true,
        },

      });



    if (!group) {

      throw new NotFoundException(
        'Permission group not found',
      );

    }





    if (dto.name) {

      group.name =
        dto.name;

    }



    if (dto.description !== undefined) {

      group.description =
        dto.description;

    }



    await this.permissionGroupRepository.save(
      group,
    );







    if (dto.actions) {


      const requiredPermissions =
        dto.actions.map(action =>

          `${this.normalize(group.name)}:${this.normalize(action)}`

        );





      const removePermissions =
        group.permissions.filter(

          permission =>
            !requiredPermissions.includes(
              permission.name,
            ),

        );





      for (const permission of removePermissions) {


        await this.deletePermission(
          permission.id,
        );


      }







      for (const permissionName of requiredPermissions) {


        const exists =
          await this.permissionRepository.findOne({

            where: {
              name: permissionName,
            },

          });



        if (!exists) {


          const permission =
            this.permissionRepository.create({

              name:
                permissionName,


              description:
                'Generated permission',


              group,

            });



          await this.permissionRepository.save(
            permission,
          );


        }

      }


    }




    return this.permissionGroupRepository.findOne({

      where: {
        id,
      },

      relations: {
        permissions: true,
      },

    });

  }









  async findAllPermissions(
    page = 1,
    limit = 10,
    search?: string,
  ) {


    const query =
      this.permissionRepository
        .createQueryBuilder('permission')
        .leftJoinAndSelect(
          'permission.group',
          'group',
        );




    if (search) {

      query.where(
        'permission.name ILIKE :search',
        {
          search:
            `%${search}%`,
        },
      );

    }




    const [data,total] =
      await query

        .skip(
          (page - 1) * limit,
        )

        .take(limit)

        .getManyAndCount();




    return {

      data,

      total,

      page,

      limit,

    };

  }









  async findAllGroups() {


    return this.permissionGroupRepository.find({

      relations: {

        permissions: true,

      },

    });


  }









  async deletePermission(
    id:string,
  ) {


    const permission =
      await this.permissionRepository.findOne({

        where:{
          id,
        },

      });



    if (!permission) {

      throw new NotFoundException(
        'Permission not found',
      );

    }




    const roles =
      await this.roleRepository.find({

        relations:{
          permissions:true,
        },

      });




    for(const role of roles){


      role.permissions =
        role.permissions.filter(

          item =>
            item.id !== id,

        );



      await this.roleRepository.save(
        role,
      );


    }






    await this.permissionRepository.remove(
      permission,
    );



    return {

      message:
        'Permission deleted successfully',

    };

  }









  private normalizePermissionName(
    name:string,
  ){

    return name
      .trim()
      .toLowerCase()
      .replace(/\s+/g,'_');

  }


}