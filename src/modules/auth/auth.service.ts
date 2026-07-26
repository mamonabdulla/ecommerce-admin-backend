import { Injectable } from '@nestjs/common';
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
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return {
        message: 'Invalid credentials',
      };
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return {
        message: 'Invalid credentials',
      };
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    const { refreshToken, refreshTokenHash } =
      this.generateRefreshToken();

    user.refreshTokenHash = refreshTokenHash;

    await this.userRepository.save(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    const refreshTokenHash = createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    const user = await this.userRepository.findOne({
      where: {
        refreshTokenHash,
      },
    });

    if (!user) {
      return {
        message: 'Invalid refresh token',
      };
    }

    const newAccessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    const {
      refreshToken: newRefreshToken,
      refreshTokenHash: newRefreshTokenHash,
    } = this.generateRefreshToken();

    user.refreshTokenHash = newRefreshTokenHash;

    await this.userRepository.save(user);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(logoutDto: LogoutDto) {
    const { refreshToken } = logoutDto;

    const refreshTokenHash = createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    const user = await this.userRepository.findOne({
      where: {
        refreshTokenHash,
      },
    });

    if (!user) {
      return {
        message: 'Invalid refresh token',
      };
    }

    user.refreshTokenHash = null;

    await this.userRepository.save(user);

    return {
      message: 'Logout successful',
    };
  }

  private generateRefreshToken() {
    const refreshToken = randomBytes(64).toString('hex');

    const refreshTokenHash = createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    return {
      refreshToken,
      refreshTokenHash,
    };
  }
}