import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { constanst } from './config/secrets';
import { AuthGuard } from './config/gaurds/auth.gaurd';
import { TypeOrmConfigService } from './datasource/typeorm.config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { RedisModule } from './config/common/services/redis/redis.module';
import { ContactsModule } from './contacts/contacts.module';
import { User } from './entities/user.entity';
import { GlobalPhoneBook } from './entities/globalPhonebook.entity';
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
      secret: constanst.JWT_SECRET,
      signOptions: { expiresIn: '5h' },
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    RedisModule.forRoot(),
    AuthModule,
    ContactsModule
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
