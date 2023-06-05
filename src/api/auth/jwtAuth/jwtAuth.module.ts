import {Module} from '@nestjs/common';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {AccessTokenStrategy} from './strategy/accessToken/accessToken.strategy';
import {RefreshTokenStrategy} from './strategy/refreshToken/refreshToken.strategy';
import {JWTAuthService} from './jwtAuth.service';

@Module({
  imports: [PassportModule, JwtModule.register({})],
  providers: [JWTAuthService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [JWTAuthService],
})
export class JWTAuthModule {}
