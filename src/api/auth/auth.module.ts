import {Module, Logger} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {JWTAuthModule} from './jwtAuth/jwtAuth.module';
import {AuthService} from './auth.service';
import {UtilModule} from '../../util/util/util.module';
import {TypeOrmExModule} from '../../db/typeorm-ex.module';
import {UsersRepository} from '../../db/repository/users/users.repository';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UsersEntity} from '../../db/repository/users/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    TypeOrmExModule.forCustomRepository([UsersRepository]),
    JWTAuthModule,
    UtilModule,
  ],
  controllers: [AuthController],
  providers: [Logger, AuthService],
})
export class AuthModule {}
