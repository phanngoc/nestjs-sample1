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

  async getMessagesByThreadId(threadId: number): Promise<Message[]> {
    let thread = await this.threadRepository.findOneBy({
      id: threadId
    });

    if (!thread) {
      return [];
    }
    console.log('getMessagesByThreadId', threadId, thread);
    return await this.messageRepository.find({
      where: {
        thread: {id: threadId}
      },
      order: {
        createdAt: 'DESC' // 'DESC' for descending order
      }
    });
  }

  async sendMessage(threadId: number, userId: number, content: string): Promise<Message | null> {
    console.log('sendMessage', threadId, userId, content);
    try {
      let user = await this.userRepository.findOneBy({ id: userId });
      let thread = await this.threadRepository.findOneBy({ id: threadId });

      const message = new Message();
      message.content = content;
      message.thread = thread;
      message.user = user;

      return await this.messageRepository.save(message);
    } catch (error) {
      // Handle error
      console.error('Error sending message:', error);
      return null;
    }
  }

}
