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
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { WSJwtAuthGuard } from '../guards/WSJwtAuthGuard';  
import { UseInterceptors } from '@nestjs/common';

  @WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
  export class EventsGateway implements OnGatewayDisconnect, OnGatewayConnection {
    @WebSocketServer()
    server: Server;
    // how to use interceptor here?
    @UseInterceptors(WSJwtAuthGuard)
    async handleConnection(client: Socket) {
      console.log('handleConnection');
      // validate client when connecting
      // if (!(await WSJwtAuthGuard.validate(client))) {
      //   client.disconnect();
      // }
    }

    async handleDisconnect(client: Socket) {
      client.disconnect();
    }

    @SubscribeMessage('events')
    onEvent(@MessageBody() data: unknown): Observable<WsResponse<number>> {
      const event = 'events';
      const response = [1, 2, 3];

      return from(response).pipe(
        map(data => ({ event, data })),
      );
    }

    @SubscribeMessage('identity')
    async identity(@MessageBody() data: number): Promise<number> {
      return data;
    }
  }