import {HttpException, HttpStatus, Inject, Injectable, Logger, LoggerService} from '@nestjs/common';
import {JoinDto, LoginDto} from './dto';
import {AccessTokenPayload, RefreshTokenPayload} from './jwtAuth//type/types';
import {JWTAuthService} from './jwtAuth/jwtAuth.service';
import {UtilService} from '../../util/util/util.service';
import {ConfigService} from '@nestjs/config';
import {UsersRepository} from '../../db/repository/users/users.repository';

@Injectable()
export class AuthService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private configService: ConfigService,
    private jwtAuthService: JWTAuthService,
    private utilService: UtilService,
    private usersRepository: UsersRepository,
  ) {}

  // 회원가입
  async join(body: JoinDto) {
    try {
      const id: string = body.id;
      const password: string = body.password;

      // id 형식 확인
      if (this.utilService.isId(id) !== true) {
        throw new HttpException(
          {
            message: '영문자 또는 숫자를 조합해서 6~20자 길이로 입력해야합니다',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // 비밀번호 형식 확인
      if (this.utilService.isPassword(password) !== true) {
        throw new HttpException(
          {
            message: '영문, 숫자, 특수문자를 최소 한가지씩 조합해서 8~16자 길이로 입력해야합니다',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // 비밀번호 암호화
      const hashPassword = await this.utilService.bcryptHash(password);

      // 액세스 토큰, 리프레쉬 토큰 생성
      const {accessToken} = this.jwtAuthService.createAccessToken(id);
      const {refreshToken} = this.jwtAuthService.createRefreshToken(id);

      // 이미 회원가입 했는지 확인
      const user = await this.usersRepository.FindOne(id);
      if (user !== undefined) {
        throw new HttpException(
          {
            message: 'id가 이미 존재합니다',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      // 회원가입
      await this.usersRepository.Join(id, hashPassword, refreshToken);

      // 액세스 토큰, 리프레쉬 토큰 반환
      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (e) {
      throw e;
    }
  }

  // 로그인
  async login(body: LoginDto) {
    try {
      const id: string = body.id;
      const password: string = body.password;

      // id 형식 확인
      if (this.utilService.isId(id) !== true) {
        throw new HttpException(
          {
            message: '영문자 또는 숫자를 조합해서 6~20자 길이로 입력해야합니다',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // 비밀번호 형식 확인
      if (this.utilService.isPassword(password) !== true) {
        throw new HttpException(
          {
            message: '영문, 숫자, 특수문자를 최소 한가지씩 조합해서 8~16자 길이로 입력해야합니다',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // 유저 존재하는지 확인
      const user = await this.usersRepository.FindOne(id);
      if (user === undefined) {
        throw new HttpException(
          {
            message: 'id가 존재하지 않습니다',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      // 비밀번호 일치하는지 확인
      const validPassword = await this.utilService.isBcryptHashValid(password, user.password);
      if (validPassword === false) {
        throw new HttpException(
          {
            message: '비밀번호가 일치하지 않습니다',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      // 액세스 토큰, 리프레쉬 토큰 생성
      const {accessToken} = this.jwtAuthService.createAccessToken(id);
      const {refreshToken} = this.jwtAuthService.createRefreshToken(id);

      // 로그인
      await this.usersRepository.Login(id, refreshToken);

      // 액세스 토큰, 리프레쉬 토큰 반환
      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (e) {
      throw e;
    }
  }

  // 로그아웃
  async logout(accessTokenPayload: AccessTokenPayload) {
    try {
      const id: string = accessTokenPayload.id;

      // 유저 존재하는지 확인
      const user = await this.usersRepository.FindOne(id);
      if (user === undefined) {
        throw new HttpException(
          {
            message: 'id가 존재하지 않습니다',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      // 로그아웃
      await this.usersRepository.Logout(id);

      return {};
    } catch (e) {
      throw e;
    }
  }

  // 리프레쉬 토큰 재발급
  async refresh(refreshTokenPayload: RefreshTokenPayload, headerRefreshToken: string) {
    try {
      const id: string = refreshTokenPayload.id;
      headerRefreshToken = headerRefreshToken.substring(7);

      // 유저 존재하는지 확인
      const user = await this.usersRepository.FindOne(id);
      if (user === undefined) {
        throw new HttpException(
          {
            message: 'id가 존재하지 않습니다',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      // 리프레쉬 토큰 일치하는지 확인
      if (headerRefreshToken !== user.refreshToken) {
        throw new HttpException(
          {
            message: '리프레쉬 토큰이 일치하지 않습니다',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      // 액세스 토큰, 리프레쉬 토큰 생성
      const {accessToken} = this.jwtAuthService.createAccessToken(id);
      const {refreshToken} = this.jwtAuthService.createRefreshToken(id);

      // 리프레쉬 토큰 저장
      await this.usersRepository.Refresh(id, refreshToken);

      // 액세스 토큰, 리프레쉬 토큰 반환
      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (e) {
      throw e;
    }
  }
}
