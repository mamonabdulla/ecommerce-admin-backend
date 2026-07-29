import 'dotenv/config';
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








  // CREATE GROUPS

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





      let permission =
        await permissionRepository.findOne({

          where: {

            name: permissionName,

          },

        });





      if (!permission) {


        permission =
          permissionRepository.create({

            name: permissionName,

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







  const allPermissions =
    await permissionRepository.find();

      // SUPER ADMIN ROLE


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


  } else {


    superAdminRole.permissions =
      allPermissions;


  }





  await roleRepository.save(
    superAdminRole,
  );









  // CATALOG MANAGER ROLE


  const catalogPermissions =
    allPermissions.filter(

      permission =>

        permission.name.startsWith(
          'product:',
        )

        ||

        permission.name.startsWith(
          'category:',
        )

        ||

        permission.name.startsWith(
          'brand:',
        )

        ||

        permission.name.startsWith(
          'attribute:',
        )

        ||

        permission.name.startsWith(
          'media:',
        ),

    );







  let catalogRole =
    await roleRepository.findOne({

      where: {

        name:
          'Catalog Manager',

      },

      relations: {

        permissions: true,

      },

    });






  if (!catalogRole) {


    catalogRole =
      roleRepository.create({

        name:
          'Catalog Manager',

        description:
          'Catalog access only',

        isActive:
          true,

        permissions:
          catalogPermissions,

      });



  } else {


    catalogRole.permissions =
      catalogPermissions;


  }






  await roleRepository.save(
    catalogRole,
  );

    // SUPER ADMIN USER


  let adminUser =
    await userRepository.findOne({

      where: {

        email:
          'admin@test.com',

      },

    });





  const adminPassword =
    await bcrypt.hash(
      '123456',
      10,
    );





  if (!adminUser) {


    adminUser =
      userRepository.create({

        name:
          'Admin',

        email:
          'admin@test.com',

        password:
          adminPassword,

        role:
          superAdminRole,

        isActive:
          true,

      });


  } else {


    adminUser.role =
      superAdminRole;


    adminUser.isActive =
      true;


  }





  await userRepository.save(
    adminUser,
  );








  // CATALOG USER


  let managerUser =
    await userRepository.findOne({

      where: {

        email:
          'manager@test.com',

      },

    });





  const managerPassword =
    await bcrypt.hash(
      '123456',
      10,
    );






  if (!managerUser) {


    managerUser =
      userRepository.create({

        name:
          'Manager User',

        email:
          'manager@test.com',

        password:
          managerPassword,

        role:
          catalogRole,

        isActive:
          true,

      });



  } else {


    managerUser.role =
      catalogRole;


    managerUser.isActive =
      true;


  }






  await userRepository.save(
    managerUser,
  );








  console.log(
    'Seed completed successfully',
  );



  await AppDataSource.destroy();


}






seed();