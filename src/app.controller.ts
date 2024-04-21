import { Body, Controller, Get, Post, Query, Req, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { UsersService } from './services/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Message } from './entities/message.entity';
import { MessageService } from './services/message.service';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'http';
import { ThreadService } from './services/thread.service';

@Controller()
export class AppController {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly appService: AppService,
    private readonly userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private messageService: MessageService,
    private threadService: ThreadService,
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

    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.identity };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  
  @Post('/api/push-message')
  async pushMessage(message: string) {
    this.server.emit('message', message);
  }

  @Get('/connect-redis')
  async connectRedis() {
    let t = {a: 1, b: 2};    
    await this.redis.set('key-tata', JSON.stringify(t));
    const redisData = await this.redis.get("key-tata");

    return 'access:' + redisData;
  }

  @Get('/api/messages')
  async getMessages(@Query('threadId') threadId: string): Promise<Message[]> {
    return this.messageService.getMessagesByThreadId(threadId);
  }

  @Post('/api/threads')
  async createThread(@Body() body: any): Promise<any> {
    const { threadId, userId } = body;
    console.log('createThread', body);
    return this.threadService.create('thread:owner', threadId, userId);
  }
}
