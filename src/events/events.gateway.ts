import {
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
    // private readonly wsJwtAuthGuard: WSJwtAuthGuard,
  ) {}

  // how to use interceptor here?
  // @UseInterceptors(this.wsJwtAuthGuard)
  async handleConnection(client: any, ...args: any[]) {
    console.log('Client connected', client.handshake.query);
    client.userId = client.handshake.query.userId;
  }

  async handleDisconnect(client: Socket) {
    client.disconnect();
  }

  @SubscribeMessage('message')
  async handleMessage(client: any, payload: any): Promise<void> {
    console.log('handleMessage', payload, client.threadId)
    const user = await this.userRepository.findOneBy({
      identity: client.userId,
    });
    const thread = await this.threadRepository.findOneBy({ uuid: client.threadId });
    console.log('thread', thread);
    if (thread && user) {
      const message = await this.messageRepository.save({ content: payload, thread, user: user });
      thread.messages.push(message);
      await this.threadRepository.save(thread);
      this.server.to(String(client.threadId)).emit('message', { content: message.content});
    }
  }

  @SubscribeMessage('joinThread')
  async joinThread(client: any, payload: any): Promise<void> {
    console.log('Joining thread:', payload);
    // Store the threadId in the client's session
    client.threadId = payload.threadId;
    client.userId = payload.userId;
  }
}