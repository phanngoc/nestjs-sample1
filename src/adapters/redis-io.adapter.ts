import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import * as Redis from 'ioredis';

const nodes = [
  {
    port: 6379,
    host: "redis-node-0"
  },
  {
    port: 6379,
    host: "redis-node-1"
  },
  {
    port: 6379,
    host: "redis-node-2"
  },
  {
    port: 6379,
    host: "redis-node-3"
  },
  {
    port: 6379,
    host: "redis-node-4"
  },
  {
    port: 6379,
    host: "redis-node-5"
  }
];

const options = {
  redisOptions: {
    // tls: true,
    password: 'bitnami',
  }
};

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const pubClient = new Redis.Cluster(nodes, options);
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient, subClient]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}