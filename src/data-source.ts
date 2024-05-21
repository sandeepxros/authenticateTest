import { DataSource, DataSourceOptions } from 'typeorm';

const config = {
  type: 'postgres',
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  username: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'local22',
  entities: ['src/api/entities/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false,
  migrationsTableName: 'spam-test-api-migrations',
  ssl:
    process.env.env === 'production'
      ? { rejectUnauthorized: false }
      : false,
};

export default new DataSource(config as DataSourceOptions);
