import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, createHash } from 'crypto';

import { User } from '../user/entities/user.entity';

import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';



@Injectable()
export class AuthService {


  constructor(

    @InjectRepository(User)
    private readonly userRepository:
      Repository<User>,


    private readonly jwtService:
      JwtService,

  ) {}







  async login(

    loginDto: LoginDto,

  ) {


    const {
      email,
      password,

    } = loginDto;





    const user =
      await this.userRepository

        .createQueryBuilder('user')

        .addSelect([
          'user.password',
        ])

        .where(
          'user.email = :email',
          {
            email,
          },
        )

        .getOne();







    if (

      !user ||

      !user.isActive

    ) {


      throw new UnauthorizedException(
        'Invalid credentials',
      );


    }







    const passwordMatched =
      await bcrypt.compare(

        password,

        user.password,

      );







    if (!passwordMatched) {


      throw new UnauthorizedException(
        'Invalid credentials',
      );


    }







    const accessToken =
      this.jwtService.sign({

        sub: user.id,

        email: user.email,

      }, {

        expiresIn: '15m',

      });







    const {

      refreshToken,

      refreshTokenHash,

    } =
      this.generateRefreshToken();







    user.refreshTokenHash =
      refreshTokenHash;



    user.refreshTokenExpiresAt =
      new Date(

        Date.now() +

        7 * 24 * 60 * 60 * 1000,

      );







    await this.userRepository.save(
      user,
    );







    return {


      accessToken,


      refreshToken,


    };


  }












  async refresh(

    refreshTokenDto: RefreshTokenDto,

  ) {


    const {

      refreshToken,

    } = refreshTokenDto;







    const refreshTokenHash =
      createHash('sha256')

        .update(refreshToken)

        .digest('hex');







    const user =
      await this.userRepository

        .createQueryBuilder('user')

        .addSelect([

          'user.refreshTokenHash',

          'user.refreshTokenExpiresAt',

        ])

        .where(

          'user.refreshTokenHash = :refreshTokenHash',

          {
            refreshTokenHash,
          },

        )

        .getOne();







    if (

      !user ||

      !user.isActive

    ) {


      throw new UnauthorizedException(
        'Invalid refresh token',
      );


    }







    if (

      user.refreshTokenExpiresAt &&

      user.refreshTokenExpiresAt < new Date()

    ) {


      throw new UnauthorizedException(
        'Refresh token expired',
      );


    }







    const accessToken =
      this.jwtService.sign({

        sub: user.id,

        email: user.email,

      }, {

        expiresIn: '15m',

      });







    const {

      refreshToken:

      newRefreshToken,


      refreshTokenHash:

      newRefreshTokenHash,

    } =
      this.generateRefreshToken();







    user.refreshTokenHash =
      newRefreshTokenHash;



    user.refreshTokenExpiresAt =
      new Date(

        Date.now() +

        7 * 24 * 24 * 60 * 60 * 1000,

      );







    await this.userRepository.save(
      user,
    );







    return {


      accessToken,


      refreshToken:

        newRefreshToken,


    };


  }












  async logout(

    logoutDto: LogoutDto,

  ) {


    const {

      refreshToken,

    } = logoutDto;







    const refreshTokenHash =
      createHash('sha256')

        .update(refreshToken)

        .digest('hex');







    const user =
      await this.userRepository

        .createQueryBuilder('user')

        .addSelect([

          'user.refreshTokenHash',

          'user.refreshTokenExpiresAt',

        ])

        .where(

          'user.refreshTokenHash = :refreshTokenHash',

          {
            refreshTokenHash,
          },

        )

        .getOne();







    if (user) {


      user.refreshTokenHash =
        null;



      user.refreshTokenExpiresAt =
        null;





      await this.userRepository.save(
        user,
      );


    }







    return {


      message:

        'Logout successful',


    };


  }












  private generateRefreshToken() {


    const refreshToken =
      randomBytes(64)

        .toString('hex');







    const refreshTokenHash =
      createHash('sha256')

        .update(refreshToken)

        .digest('hex');







    return {


      refreshToken,


      refreshTokenHash,


    };


  }


}