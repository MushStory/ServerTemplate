import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {AccessTokenPayload, RefreshTokenPayload} from './type/types';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class JWTAuthService {
  constructor(private jwtService: JwtService, private configService: ConfigService) {}

  createAccessToken(id: string) {
    try {
      // payload 생성
      const payload: AccessTokenPayload = {
        id: id,
      };

      // 액세스토큰 생성
      const accessToken = this.jwtService.sign(payload, {
        expiresIn: '1h',
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      });

      // 액세스토큰 반환
      return {
        accessToken: accessToken,
      };
    } catch (e) {
      throw e;
    }
  }

  createRefreshToken(id: string) {
    try {
      // payload 생성
      const payload: RefreshTokenPayload = {
        id: id,
      };

      // 리프레쉬 토큰 생성
      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: '14d',
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      });

      // 리프레쉬 토큰 반환
      return {
        refreshToken: refreshToken,
      };
    } catch (e) {
      throw e;
    }
  }
}
