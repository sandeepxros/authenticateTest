import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { secrets } from 'src/config/secrets';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: secrets.PGHOST,
      port: Number(secrets.PGPORT),
      username: secrets.PGUSER,
      password: secrets.PGPASSWORD,
      database: secrets.PGDATABASE,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: secrets.AUTOSYNC_DB === 'TRUE',
      logging: secrets.DB_LOGGING==="TRUE",
      autoLoadEntities:true,
    };
  }
}
