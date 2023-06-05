import {Repository} from 'typeorm';
import {UsersEntity} from './users.entity';
import {CustomRepository} from '../../typeorm-ex.decorator';

@CustomRepository(UsersEntity)
export class UsersRepository extends Repository<UsersEntity> {
  async FindOne(id: string) {
    return await this.createQueryBuilder('users')
      .where('users.id = :id', {
        id: id,
      })
      .getOne();
  }

  async Join(id: string, password: string, refreshToken: string) {
    try {
      return await this.createQueryBuilder('users')
        .insert()
        .into(UsersEntity)
        .values([
          {
            id: id,
            password: password,
            refreshToken: refreshToken,
            created_at: new Date(),
          },
        ])
        .execute();
    } catch (e) {
      throw e;
    }
  }

  async Login(id: string, refreshToken: string) {
    try {
      return await this.createQueryBuilder('users')
        .update(UsersEntity)
        .set({
          refreshToken: refreshToken,
          updated_at: new Date(),
        })
        .where('id = :id', {id: id})
        .execute();
    } catch (e) {
      throw e;
    }
  }

  async Logout(id: string) {
    try {
      return await this.createQueryBuilder('users')
        .update(UsersEntity)
        .set({
          refreshToken: null,
          updated_at: new Date(),
        })
        .where('id = :id', {id: id})
        .execute();
    } catch (e) {
      throw e;
    }
  }

  async Refresh(id: string, refreshToken: string) {
    try {
      return await this.createQueryBuilder('users')
        .update(UsersEntity)
        .set({
          refreshToken: refreshToken,
          updated_at: new Date(),
        })
        .where('id = :id', {id: id})
        .execute();
    } catch (e) {
      throw e;
    }
  }
}
