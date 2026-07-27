import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Permission } from './entities/permission.entity';
import { PermissionGroup } from './entities/permission-group.entity';

import { CreatePermissionGroupDto } from './dto/create-permission-group.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionGroupDto } from './dto/update-permission-group.dto';


@Injectable()
export class PermissionService {


  constructor(

    @InjectRepository(PermissionGroup)
    private readonly permissionGroupRepository:
      Repository<PermissionGroup>,


    @InjectRepository(Permission)
    private readonly permissionRepository:
      Repository<Permission>,

  ) {}





  async createGroup(
    createPermissionGroupDto: CreatePermissionGroupDto,
  ) {


    const {
      name,
      description,
      actions,
    } = createPermissionGroupDto;



    const existingGroup =
      await this.permissionGroupRepository.findOne({
        where: {
          name,
        },
      });



    if (existingGroup) {

      throw new ConflictException(
        'Permission group already exists',
      );

    }





    return this.permissionGroupRepository.manager.transaction(

      async (manager) => {


        const group =
          manager.create(
            PermissionGroup,
            {
              name,
              description,
            },
          );



        const savedGroup =
          await manager.save(group);





        const permissions =
          actions.map((action) =>

            manager.create(
              Permission,
              {

                name:
                  `${name.toLowerCase()}:${action.toLowerCase()}`,

                description:
                  `${action} permission for ${name}`,

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
    createPermissionDto: CreatePermissionDto,
  ) {


    const {
      groupId,
      ...permissionData
    } = createPermissionDto;




    const group =
      await this.permissionGroupRepository.findOne({
        where: {
          id: groupId,
        },
      });



    if (!group) {

      throw new NotFoundException(
        'Permission group not found',
      );

    }




    const existingPermission =
      await this.permissionRepository.findOne({
        where: {
          name: permissionData.name,
        },
      });



    if (existingPermission) {

      throw new ConflictException(
        'Permission already exists',
      );

    }




    const permission =
      this.permissionRepository.create({

        ...permissionData,

        group,

      });



    return this.permissionRepository.save(
      permission,
    );

  }

    async updateGroup(
    id: string,
    updatePermissionGroupDto: UpdatePermissionGroupDto,
  ) {


    const {
      name,
      description,
      actions,
    } = updatePermissionGroupDto;




    return this.permissionGroupRepository.manager.transaction(

      async (manager) => {


        const group =
          await manager.findOne(
            PermissionGroup,
            {
              where: {
                id,
              },

            },
          );




        if (!group) {

          throw new NotFoundException(
            'Permission group not found',
          );

        }





        if (name) {

          group.name = name;

        }




        if (description !== undefined) {

          group.description =
            description;

        }





        await manager.save(
          PermissionGroup,
          group,
        );






        if (actions) {


          const newPermissions: Permission[] = [];



          for (const action of actions) {


            const permissionName =
              `${group.name.toLowerCase()}:${action.toLowerCase()}`;



            // Check globally because Permission.name is unique
            const existingPermission =
              await manager.findOne(
                Permission,
                {
                  where: {
                    name: permissionName,
                  },
                },
              );




            if (!existingPermission) {


              const permission =
                manager.create(
                  Permission,
                  {

                    name:
                      permissionName,


                    description:
                      `${action} permission for ${group.name}`,


                    group,

                  },
                );



              newPermissions.push(
                permission,
              );


            }


          }






          if (newPermissions.length > 0) {


            await manager.save(
              Permission,
              newPermissions,
            );


          }


        }





        return manager.findOne(
          PermissionGroup,
          {

            where: {
              id,
            },


            relations: {
              permissions: true,
            },

          },
        );


      },

    );


  }







  async findAllGroups() {


    return this.permissionGroupRepository.find({

      relations: {

        permissions: true,

      },

    });


  }








  async findAllPermissions() {


    return this.permissionRepository.find({

      relations: {

        group: true,

      },

    });


  }








  async deletePermission(
    id: string,
  ) {


    const permission =
      await this.permissionRepository.findOne({

        where: {
          id,
        },

      });




    if (!permission) {

      throw new NotFoundException(
        'Permission not found',
      );

    }





    await this.permissionRepository.delete(
      id,
    );




    return {

      message:
        'Permission deleted successfully',

    };


  }


}