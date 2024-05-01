import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { Thread } from 'src/entities/thread.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { Message } from 'src/entities/message.entity';
import { WSJwtAuthGuard } from './WSJwtAuthGuard';

@Module({
  imports: [TypeOrmModule, TypeOrmModule.forFeature([User, Message, Thread])],
  providers: [EventsGateway, WSJwtAuthGuard],
  exports: [EventsGateway],
})
export class EventsModule {}