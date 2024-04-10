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
import { JwtModule, JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';
import { ConfigModule, ConfigService } from '@nestjs/config';

config();

console.log('process.env.JWT_SECRET', process.env.JWT_SECRET);
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secretOrPrivateKey: configService.get('JWT_SECRET'),
      }),
    }),
    // JwtModule.register({
    //   global: true,
    //   secret: 'THISISSECRETTTA', // This should be your secret key
    //   signOptions: { expiresIn: '60s' },
    //   // secretOrPrivateKey: process.env.JWT_SECRET,
    // }),
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
      entities: [User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
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
  providers: [AppService, UsersService, JwtService],
})
export class AppModule {}
