import {Controller, Post, Body, UseGuards, Request} from '@nestjs/common';
import {AuthService} from './auth.service';
import {JoinDto, LoginDto} from './dto';
import {AccessTokenGuard} from './jwtAuth/strategy/accessToken/accessToken.guard';
import {RefreshTokenGuard} from './jwtAuth/strategy/refreshToken/refreshToken.guard';
import {AccessTokenPayload, RefreshTokenPayload} from './jwtAuth/type/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/join')
  async join(@Body() body: JoinDto) {
    try {
      return await this.authService.join(body);
    } catch (e) {
      throw e;
    }
  }

  @Post('/login')
  async login(@Body() body: LoginDto) {
    try {
      return await this.authService.login(body);
    } catch (e) {
      throw e;
    }
  }

  @UseGuards(AccessTokenGuard)
  @Post('/logout')
  async logout(@Request() req) {
    try {
      const payload: AccessTokenPayload = req.user;

      return await this.authService.logout(payload);
    } catch (e) {
      throw e;
    }
  }

  @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  async refresh(@Request() req) {
    try {
      const payload: RefreshTokenPayload = req.user;
      const refreshToken: string = req.headers.authorization;

      return await this.authService.refresh(payload, refreshToken);
    } catch (e) {
      throw e;
    }
  }
}
