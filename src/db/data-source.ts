import {DataSource, DataSourceOptions} from 'typeorm';
import {getDataSourceConfig} from './data-source-config';
import {config} from 'dotenv';

config({
  path: __dirname + '/../../.env',
});

export default new DataSource(getDataSourceConfig() as DataSourceOptions);
