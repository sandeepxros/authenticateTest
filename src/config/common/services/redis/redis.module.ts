import { Module, Global, DynamicModule } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisService } from './redis.service';
import { secrets } from 'src/config/secrets';

@Global()
@Module({})
export class RedisModule {
  static forRoot(): DynamicModule {
    const redisProvider = {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const client = createClient({
          url: secrets.REDIS_URL,
        });
        client.connect();
        return client;
      },
    };

    return {
      module: RedisModule,
      providers: [redisProvider, RedisService],
      exports: [redisProvider, RedisService],
    };
  }
}
