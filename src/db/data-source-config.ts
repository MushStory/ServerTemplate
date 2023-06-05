export const getDataSourceConfig = (isTest: boolean = Boolean(process.env.TEST_ENV)) => {
  return {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: isTest !== true ? process.env.DB_NAME : 'test_' + process.env.DB_NAME,
    synchronize: isTest,
    dropSchema: isTest,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    migrationsTableName: 'migrations',
    migrationsRun: true,
  };
};
