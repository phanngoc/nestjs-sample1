import { Controller, Get, Post, Req, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { UsersService } from './services/users.service';
import { JwtService } from '@nestjs/jwt';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UsersService,
    private jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
    ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/api/signin')
  async signIn(@Req() request): Promise<{ access_token: string }> {
    const { email, password } = request.body;
    const user = await this.userService.findOneBy({email: email});
    console.log('user:', user);
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.firstName + user.lastName };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  @Get('/connect-redis')
  async connectRedis() {
    let t = {a: 1, b: 2};    
    await this.redis.set('key-tata', JSON.stringify(t));
    const redisData = await this.redis.get("key-tata");

    return 'access:' + redisData;
  }
}
