import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from './../src/app.module';
import {getDataSourceConfig} from '../src/db/data-source-config';
import {DataSource, DataSourceOptions} from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let db: DataSource;

  beforeAll(async () => {
    // 데이터베이스 연결
    const dbConfig = getDataSourceConfig(false);
    db = new DataSource(dbConfig as DataSourceOptions);
    await db.initialize();

    // 테스트 데이터베이스 생성
    const testDBConfig = getDataSourceConfig(true);
    const isTestDBExistResult = await db.query(`SHOW DATABASES LIKE '${testDBConfig.database}'`);
    if (isTestDBExistResult.length < 1) {
      await db.query(`CREATE DATABASE ${testDBConfig.database}`);
    }

    // App Module 생성
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    // 데이터베이스 연결 종료
    await db.destroy();

    // App Module 종료
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
  });
});
