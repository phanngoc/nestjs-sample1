import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from '@nestjs-modules/ioredis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { EventsModule } from './events/events.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'frontend', 'build'),
    }),
    EventsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgresql',
      port: 5432,
      username: 'nestjs',
      password: 'password',
      database: 'nestjs',
      entities: [],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, UsersService]),
    RedisModule.forRoot({
      type: 'cluster',
      nodes: [
          {
              host: 'redis-node-0',
              port: 6379
          },
          {
              host: 'redis-node-1',
              port: 6379
          },
          {
              host: 'redis-node-2',
              port: 6379
          },
          {
              host: 'redis-node-3',
              port: 6379
          },
          {
              host: 'redis-node-4',
              port: 6379
          },
          {
              host: 'redis-node-5',
              port: 6379
          }
      ],
      options: {
        redisOptions: {
          password: 'bitnami'
        }
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
