import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../entities/message.entity';
import { Repository } from 'typeorm';
import { Thread } from 'src/entities/thread.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Thread)
    private readonly threadRepository: Repository<Thread>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllMessages(): Promise<Message[]> {
    return this.messageRepository.find();
  }

  async getMessagesByThreadId(threadId: string): Promise<Message[]> {
    let thread = await this.threadRepository.findOne({
      where: {
        uuid: threadId
      }
    });

    if (!thread) {
      return [];
    }
    return this.messageRepository.find({
      where: {
        thread: thread
      },
      order: {
        createdAt: 'DESC' // 'DESC' for descending order
      }
    });
  }

  async sendMessage(threadId: string, text: string): Promise<Message | null> {
    console.log('sendMessage', threadId, text, this.userRepository);
    try {
      let user = await this.userRepository.findOne({
        where: {
          id: 1,
        },  
      });
      if (!user) {
        user = new User();
        user.identity = threadId;
        await this.userRepository.save(user);
      }

      let thread = await this.threadRepository.findOne(
        {
          where: {
            uuid: threadId
          },
        }
      );
      if (!thread) {
        thread = new Thread();
        thread.uuid = threadId;
        await this.threadRepository.save(thread);
      } else if (!thread.users.find(u => u.id === user.id)) {
        thread.users.push(user);
        await this.threadRepository.save(thread);
      }

      const message = new Message();
      message.content = text;
      message.thread = thread;

      return await this.messageRepository.save(message);
    } catch (error) {
      // Handle error
      console.error('Error sending message:', error);
      return null;
    }
  }

}
