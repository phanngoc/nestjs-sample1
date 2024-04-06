import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectRedis() private readonly redis: Redis,
    ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/connect-redis')
  async connectRedis() {
    let t = {a: 1, b: 2};    
    await this.redis.set('key-tata', JSON.stringify(t));
    const redisData = await this.redis.get("key-tata");

    return 'access:' + redisData;
  }
}
