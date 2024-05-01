import { Body, Controller, Get, Post, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
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
import * as bcrypt from 'bcryptjs';
import { AuthService } from './services/auth.service';
import { LoadUserGuard } from './guards/LoadUserGuard';
import { v4 as uuidv4 } from 'uuid';

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
    private authService: AuthService,
    @InjectRedis() private readonly redis: Redis,
    ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/api/signin')
  async signIn(@Req() request): Promise<{ access_token: string }> {
    console.log('signIn:', request.body);
    const { email, password } = request.body;
    const user = await this.userService.findOneBy({identity: email});

    if (!user || !(await bcrypt.compareSync(password, user.password))) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.identity };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  
  // handle get request load info user
  @Get('/api/user')
  @UseGuards(LoadUserGuard)
  async loadInfoUser(@Req() request): Promise<any> {
    console.log('loadInfoUser:', request.user);
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
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
  async getMessages(@Query('threadId') threadId: number): Promise<Message[]> {
    console.log('getMessages:', threadId);
    return this.messageService.getMessagesByThreadId(threadId);
  }

  // get thread user join.
  @UseGuards(LoadUserGuard)
  @Get('/api/threads')
  async getThreads(@Req() req): Promise<any> {
    console.log('getThreads:', req.user);
    // check page in request query
    let page = req.query.page = req.query.page || 1;
    let paginationDto = { page: page, limit: 10 };

    let threads = await this.threadService.findThreadsByUser(req.user, paginationDto);

    // count thread , if not exist and create new thread
    if (threads.length === 0) {
      // create threadid by uuid
      let threaduuid = uuidv4();
      let newThread = await this.threadService.create('New chat', threaduuid, req.user.identity);
      threads = [newThread];
    }

    return threads;
  }

  @Post('/api/threads')
  async createThread(@Body() body: any): Promise<any> {
    const { threadId, userId } = body;
    console.log('createThread', body);
    return this.threadService.create('thread:owner', threadId, userId);
  }

  // handle get post request and save into message
  @UseGuards(LoadUserGuard)
  @Post('/api/messages')
  async createMessage(@Body() body: any, @Req() req): Promise<any> {
    console.log('createMessage:', body);
    const { threadId, content } = body;
    const userId = req.user.id;
    return this.messageService.sendMessage(threadId, userId, content);
  }
}
