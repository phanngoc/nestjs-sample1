import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from '@nestjs-modules/ioredis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { EventsModule } from './events/events.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Message } from './entities/message.entity';
import { MessageService } from './services/message.service';
import { Thread } from './entities/thread.entity';
import { ThreadService } from './services/thread.service';
import { UserSeederService } from './seeders/UserSeederService';
import { AuthService } from './services/auth.service';
import { ThreadSeederService } from './seeders/ThreadSeederService';
import { BullModule } from '@nestjs/bullmq';
import { Redis } from 'ioredis';

config();
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
    }),
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
      entities: [User, Message, Thread],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Message, Thread]),
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'cluster',
        nodes: JSON.parse(configService.get<string>('REDIS_NODES')),
        options: {
          redisOptions: {
            password: configService.get('REDIS_PASSWORD'),
          },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, UsersService, MessageService, ThreadService, AuthService, UserSeederService, ThreadSeederService],
  exports: [TypeOrmModule, TypeOrmModule.forFeature([User, Message, Thread])],
})

export class AppModule implements OnModuleInit {
  constructor(
    private readonly userSeederService: UserSeederService,
    private readonly threadSeederService: ThreadSeederService
  ) {}

  async onModuleInit() {
    await this.userSeederService.seed();
    await this.threadSeederService.seed();
  }
}

