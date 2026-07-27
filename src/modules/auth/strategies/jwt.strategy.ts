import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

import { ConfigService } from '@nestjs/config';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../user/entities/user.entity';


@Injectable()
export class JwtStrategy 
extends PassportStrategy(Strategy) {


  constructor(

    private readonly configService: ConfigService,


    @InjectRepository(User)
    private readonly userRepository:
      Repository<User>,

  ) {


    super({

      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),


      secretOrKey:
        configService.get<string>(
          'JWT_SECRET',
        ) ?? '',

    });

  }



  async validate(payload: any) {


    const user =
      await this.userRepository.findOne({

        where: {
          id: payload.sub,
        },


        relations: {

          role: {

            permissions: true,

          },

        },

      });



    if (!user || !user.isActive) {

      return null;

    }



    return {

      id: user.id,

      email: user.email,

      name: user.name,


      role:
        user.role?.name ?? null,


      permissions:
        user.role?.permissions?.map(
          permission =>
            permission.name,
        ) ?? [],

    };

  }

}