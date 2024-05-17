import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(
    @Inject('REDIS_CLIENT') private readonly client: RedisClientType,
  ) {}

  async onModuleDestroy() {
    await this.client.quit();
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }

  async hset(key: string, field: string, values: string): Promise<void> {
    await this.client.hSet(key, field, values);
  }

  async hGet(key: string, field: string): Promise<any> {
    return await this.client.hGet(key, field);
  }

  async hDel(key: string, field: string): Promise<void> {
    await this.client.hDel(key, field);
  }

  async hGetAll(key: string) {
    return await this.client.hGetAll(key);
  }
}
