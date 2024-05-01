import {
  ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
  } from '@nestjs/websockets';
import { Socket } from 'dgram';
import { Server } from 'socket.io';
import { WSJwtAuthGuard } from './WSJwtAuthGuard';
import { Injectable, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/entities/message.entity';
import { Thread } from 'src/entities/thread.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})

@Injectable()
export class EventsGateway implements OnGatewayDisconnect, OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Thread)
    private readonly threadRepository: Repository<Thread>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  // how to use interceptor here?
  // @UseInterceptors(this.wsJwtAuthGuard)
  async handleConnection(client: any, ...args: any[]) {
    console.log('Client connected', client.handshake.query);
    client.userId = client.handshake.query.userId;
  }

  async handleDisconnect(client: any) {
    const threads = await this.redis.smembers(`client:${client.id}`);
    console.log('Client disconnected', client.id, threads);
    threads.forEach(async (threadId) => {
      await this.redis.srem(`thread:${threadId}`, client.id);
    });

    client.disconnect();
  }

  @SubscribeMessage('message')
  async handleMessage(client: any, payload: any): Promise<void> {
    console.log('handleMessage', payload, client.threadId)
    const user = await this.userRepository.findOneBy({
      identity: client.userId,
    });
    const thread = await this.threadRepository.findOneBy({ uuid: client.threadId });

    if (thread && user) {
      const message = await this.messageRepository.save({ content: payload, thread, user: user });
      thread.messages.push(message);
      await this.threadRepository.save(thread);
      this.server.to(String(client.threadId)).emit('message', { content: message.content});
    }
  }
  
  async pushMessageToThread(message: Message, threadId: number): Promise<void> {
    let clientIds = await this.redis.smembers(`thread:${threadId}`);
    console.log('pushMessageToThread', message, threadId, clientIds);
    if (clientIds) {
      clientIds.forEach(clientId => {
        this.server.to(clientId).emit('messages', { content: message.content });
      });
    }
  }

  @SubscribeMessage('joinThread')
  async joinThread(client: any, payload: {threadId: number}): Promise<void> {
    console.log('Joining thread:', payload, client.id);
    // Store the threadId in the client's session
    const { threadId } = payload;
    await this.redis.sadd(`thread:${threadId}`, client.id);
    await this.redis.sadd(`client:${client.id}`, threadId.toString());
  }

  @SubscribeMessage('leaveThread')
  async handleLeaveThread(@MessageBody() data: { threadId: number }, client: any) {
    const { threadId } = data;
    console.log('Leaving thread:', threadId, client.id);
    await this.redis.srem(`thread:${threadId}`, client.id);
    await this.redis.srem(`client:${client.id}`, threadId.toString());
  }
}