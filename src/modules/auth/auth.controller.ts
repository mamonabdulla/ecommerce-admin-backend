import {
  Body,
  Controller,
  Get,
  Post,
  Req,
} from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';

import { AuthService } from './auth.service';

import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';

import { Public } from '../../common/decorators/public.decorator';
import { Permission } from '../../common/decorators/permission.decorator';



@Controller('auth')
export class AuthController {


  constructor(
    private readonly authService: AuthService,
  ) {}



  @Public()
  @Post('login')
  login(
    @Body() loginDto: LoginDto,
  ) {

    return this.authService.login(
      loginDto,
    );

  }




  @Public()
  @Post('refresh')
  refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {

    return this.authService.refresh(
      refreshTokenDto,
    );

  }




  @Public()
  @Post('logout')
  logout(
    @Body() logoutDto: LogoutDto,
  ) {

    return this.authService.logout(
      logoutDto,
    );

  }





  @ApiBearerAuth()
  @Get('session')
  session(
    @Req() req,
  ) {

    return {

      user:
        req.user ?? null,


      role:
        req.user?.role ?? null,


      permissions:
        req.user?.permissions ?? [],

    };

  }





  @ApiBearerAuth()
  @Get('profile')
  profile(
    @Req() req,
  ) {

    return {

      message:
        'JWT is working',


      user:
        req.user,

    };

  }





  @ApiBearerAuth()
  @Permission('product:create')
  @Get('test-create-product')
  testCreateProduct() {

    return {

      message:
        'You have product:create permission',

    };

  }



}