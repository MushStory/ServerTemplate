import {Test} from '@nestjs/testing';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {JoinDto, LoginDto} from './dto';
import {Logger} from '@nestjs/common';
import {JWTAuthModule} from './jwtAuth/jwtAuth.module';
import {UtilService} from '../../util/util/util.service';
import {InsertResult, Repository, UpdateResult} from 'typeorm';
import {getRepositoryToken} from '@nestjs/typeorm';
import {AccessTokenPayload, RefreshTokenPayload} from './jwtAuth/type/types';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {UsersRepository} from '../../db/repository/users/users.repository';
import {UsersEntity} from '../../db/repository/users/users.entity';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockRepository = () => ({
  createQueryBuilder: jest.fn().mockReturnValue({
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    into: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    execute: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
  }),
  FindOne: UsersRepository.prototype.FindOne,
  Join: UsersRepository.prototype.Join,
  Login: UsersRepository.prototype.Login,
  Refresh: UsersRepository.prototype.Refresh,
});

describe('AuthController', () => {
  let controller;
  let service;
  let usersRepository: MockRepository<UsersRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        JWTAuthModule,
      ],
      controllers: [AuthController],
      providers: [
        Logger,
        ConfigService,
        UtilService,
        AuthService,
        {provide: getRepositoryToken(UsersRepository), useValue: mockRepository()},
      ],
    }).compile();

    controller = module.get(AuthController);
    service = module.get(AuthService);
    usersRepository = module.get<MockRepository<UsersRepository>>(getRepositoryToken(UsersRepository));
  });

  describe('/auth/join', () => {
    it('it should return result', async () => {
      const parameter: JoinDto = {
        id: 'test1234',
        password: 'test@1234',
      };

      jest.spyOn(service, 'join');
      jest.spyOn(usersRepository.createQueryBuilder(), 'getOne').mockResolvedValue(undefined);
      jest.spyOn(usersRepository.createQueryBuilder(), 'execute').mockResolvedValue(new InsertResult());
      const controllerResult = await controller.join(parameter);
      expect(controllerResult).toHaveProperty('accessToken');
      expect(controllerResult).toHaveProperty('refreshToken');
      expect(service.join).toBeCalledTimes(1);
      expect(service.join).toBeCalledWith(parameter);
    });
  });

  describe('/auth/login', () => {
    it('it should return result', async () => {
      const parameter: LoginDto = {
        id: 'test1234',
        password: 'test@1234',
      };
      const usersEntity = new UsersEntity();
      usersEntity.password = '$2b$10$SnL93slQ0mH.lPMy8M50lOX6DlE4.ZUcZ4qBP7eFaG6dXx6MkPc9a';

      jest.spyOn(service, 'login');
      jest.spyOn(usersRepository.createQueryBuilder(), 'getOne').mockResolvedValue(usersEntity);
      jest.spyOn(usersRepository.createQueryBuilder(), 'execute').mockResolvedValue(new UpdateResult());
      const controllerResult = await controller.login(parameter);
      expect(controllerResult).toHaveProperty('accessToken');
      expect(controllerResult).toHaveProperty('refreshToken');
      expect(service.login).toBeCalledTimes(1);
      expect(service.login).toBeCalledWith(parameter);
    });
  });

  describe('/auth/logout', () => {
    it('it should return result', async () => {
      const parameter: {user: AccessTokenPayload} = {
        user: {
          id: 'test1234',
        },
      };
      const returnValue = {};

      jest.spyOn(service, 'logout').mockResolvedValue(returnValue);
      jest.spyOn(usersRepository.createQueryBuilder(), 'getOne').mockResolvedValue(new UsersEntity());
      jest.spyOn(usersRepository.createQueryBuilder(), 'execute').mockResolvedValue(new UpdateResult());
      expect(await controller.logout(parameter)).toEqual(returnValue);
      expect(service.logout).toBeCalledTimes(1);
      expect(service.logout).toBeCalledWith(parameter.user);
    });
  });

  describe('/auth/refresh', () => {
    it('it should return result', async () => {
      const parameter: {user: RefreshTokenPayload; headers: {authorization: string}} = {
        user: {
          id: 'test1234',
        },
        headers: {
          authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QxMjM0IiwiaWF0IjoxNjg1OTA2MjI5LCJleHAiOjE2ODcxMTU4Mjl9.Ff4mTY3frtV56iXr37tEFNdVe-sv0hVaqL-Ewro-ZjA',
        },
      };
      const usersEntity = new UsersEntity();
      usersEntity.refreshToken = parameter.headers.authorization.substring(7);

      jest.spyOn(service, 'refresh');
      jest.spyOn(usersRepository.createQueryBuilder(), 'getOne').mockResolvedValue(usersEntity);
      jest.spyOn(usersRepository.createQueryBuilder(), 'execute').mockResolvedValue(new UpdateResult());
      const controllerResult = await controller.refresh(parameter);
      expect(controllerResult).toHaveProperty('accessToken');
      expect(controllerResult).toHaveProperty('refreshToken');
      expect(service.refresh).toBeCalledTimes(1);
      expect(service.refresh).toBeCalledWith(parameter.user, parameter.headers.authorization);
    });
  });
});
