
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Thread } from '../entities/thread.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class ThreadService {
  constructor(
    @InjectRepository(Thread)
    private threadRepository: Repository<Thread>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<Thread[]> {
    return this.threadRepository.find();
  }

  findOne(id: number): Promise<Thread | null> {
    return this.threadRepository.findOneBy({ id });
  }

  findOneBy(condition): Promise<Thread | null> {
    return this.threadRepository.findOneBy(condition);
  }

  async remove(id: number): Promise<void> {
    await this.threadRepository.delete(id);
  }

  async create(title: string, threadUuid: string, userId: string): Promise<Thread> {
    let user = await this.userRepository.findOneBy({ identity: userId });
    let thread = await this.threadRepository.findOneBy({ uuid: threadUuid });
    
    if (!thread) {
        const thread = new Thread();
        thread.title = title;
        thread.uuid = threadUuid;
        thread.owner = user;
        return await this.threadRepository.save(thread);
    }

    return thread;
  }
}