import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APIModule } from './api/api.module';
import { secrets } from './config/secrets';
import { AuthGuard } from './config/gaurds/auth.gaurd';
import { TypeOrmConfigService } from './datasource/typeorm.config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { RedisModule } from './config/common/services/redis/redis.module';
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 1000,
        limit: 4,
      },
    ]),
    JwtModule.register({
      global: true,
      secret: secrets.JWT_SECRET,
      signOptions: { expiresIn: '5h' },
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    RedisModule.forRoot(),
    APIModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
