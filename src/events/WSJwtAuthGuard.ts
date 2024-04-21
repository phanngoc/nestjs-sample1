import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class WSJwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake.query.token;
    console.log('canActivate:', { token });
    if (!token) {
      throw new WsException('Missing JWT token');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      context.switchToWs().getData().user = decoded;
      return true;
    } catch (err) {
      throw new WsException('Invalid JWT token');
    }
  }
}