import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Permission } from '../modules/permission/entities/permission.entity';
import { PermissionGroup } from '../modules/permission/entities/permission-group.entity';

import { Role } from '../modules/role/entities/role.entity';
import { User } from '../modules/user/entities/user.entity';



const AppDataSource = new DataSource({

  type: 'postgres',

  host:
    process.env.DATABASE_HOST,

  port:
    Number(
      process.env.DATABASE_PORT,
    ),

  username:
    process.env.DATABASE_USER,

  password:
    process.env.DATABASE_PASSWORD,

  database:
    process.env.DATABASE_NAME,


  entities: [

    Permission,

    PermissionGroup,

    Role,

    User,

  ],


  synchronize: false,

});







async function seed() {


  await AppDataSource.initialize();




  const permissionGroupRepository =
    AppDataSource.getRepository(
      PermissionGroup,
    );


  const permissionRepository =
    AppDataSource.getRepository(
      Permission,
    );


  const roleRepository =
    AppDataSource.getRepository(
      Role,
    );


  const userRepository =
    AppDataSource.getRepository(
      User,
    );




  console.log(
    'Database connected',
  );







  const permissionMap = {


    dashboard: [

      'watch',

    ],


    permission: [

      'watch',
      'create',
      'read',
      'update',
      'delete',

    ],


    role: [

      'watch',
      'create',
      'read',
      'update',
      'delete',

    ],


    user: [

      'watch',
      'create',
      'read',
      'update',
      'delete',

    ],


    media: [

      'watch',
      'read',
      'upload',
      'write',
      'delete',

    ],


    category: [

      'watch',
      'create',
      'read',
      'update',
      'delete',

    ],


    brand: [

      'watch',
      'create',
      'read',
      'update',
      'delete',

    ],


    attribute: [

      'watch',
      'create',
      'read',
      'update',
      'delete',

    ],


    product: [

      'watch',
      'create',
      'read',
      'update',
      'delete',

    ],


  };








  // CREATE PERMISSION GROUPS

  for (
    const groupName of Object.keys(permissionMap)
  ) {


    let group =
      await permissionGroupRepository.findOne({

        where: {
          name: groupName,
        },

      });




    if (!group) {


      group =
        permissionGroupRepository.create({

          name: groupName,

          description:
            `${groupName} module permissions`,

        });


      await permissionGroupRepository.save(
        group,
      );


    }


  }




  console.log(
    'Permission groups created',
  );








  // CREATE PERMISSIONS

  for (
    const groupName of Object.keys(permissionMap)
  ) {


    const group =
      await permissionGroupRepository.findOne({

        where: {
          name: groupName,
        },

      });



    if (!group) continue;




    for (
      const action of permissionMap[groupName]
    ) {


      const permissionName =
        `${groupName}:${action}`;




      const exists =
        await permissionRepository.findOne({

          where: {
            name: permissionName,
          },

        });




      if (!exists) {


        const permission =
          permissionRepository.create({

            name:
              permissionName,


            description:
              `${permissionName} permission`,


            group,

          });



        await permissionRepository.save(
          permission,
        );


      }


    }


  }





  console.log(
    'Permissions created',
  );








  // GET ALL PERMISSIONS

  const allPermissions =
    await permissionRepository.find();








  // CREATE SUPER ADMIN ROLE


  let superAdminRole =
    await roleRepository.findOne({

      where: {
        name: 'Super Admin',
      },

      relations: {
        permissions: true,
      },

    });





  if (!superAdminRole) {


    superAdminRole =
      roleRepository.create({

        name:
          'Super Admin',


        description:
          'System owner role',


        isActive:
          true,


        permissions:
          allPermissions,

      });



    await roleRepository.save(
      superAdminRole,
    );


  }





  console.log(
    'Super Admin role created',
  );








  // CREATE ADMIN ROLE


  const adminPermissions =
    allPermissions.filter(

      permission =>

        !permission.name.startsWith(
          'permission:delete',
        ),

    );





  let adminRole =
    await roleRepository.findOne({

      where: {
        name: 'Admin',
      },

      relations: {
        permissions: true,
      },

    });





  if (!adminRole) {


    adminRole =
      roleRepository.create({

        name:
          'Admin',


        description:
          'Administrator role',


        isActive:
          true,


        permissions:
          adminPermissions,

      });



    await roleRepository.save(
      adminRole,
    );


  }




  console.log(
    'Admin role created',
  );








  // CREATE SUPER ADMIN USER


  const existingUser =
    await userRepository.findOne({

      where: {

        email:
          'superadmin@example.com',

      },

    });





  if (!existingUser) {


    const password =
      await bcrypt.hash(
        'SuperAdmin@123',
        10,
      );




    const user =
      userRepository.create({

        name:
          'Super Admin',


        email:
          'superadmin@example.com',


        password,


        role:
          superAdminRole,


        isActive:
          true,

      });




    await userRepository.save(
      user,
    );


  }





  console.log(
    'Super Admin user created',
  );







  await AppDataSource.destroy();


}





seed();