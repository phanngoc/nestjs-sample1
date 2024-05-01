import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { AuthService } from 'src/services/auth.service';
import { Thread } from 'src/entities/thread.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ThreadSeederService {
  constructor(
    @InjectRepository(Thread)
    private readonly threadRepository: Repository<Thread>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async seed() {
    // Check if users already exist
    const threadsExists = await this.threadRepository.count();
    if (threadsExists) {
      console.log('Threads already seeded.');
      return;
    }
    let user = await this.userRepository.findOneBy({ identity: 'user1@example.com' });

    const threadsToCreate = [
      { owner: user, title: 'New chat 1' },
      { owner: user, title: 'New chat 2' },
    ];

    for (const threadData of threadsToCreate) {
      const thread = new Thread();
      thread.uuid = uuidv4();
      thread.owner = threadData.owner;
      thread.title = threadData.title;
      await this.userRepository.save(user);

      console.log(`User ${this.threadRepository.count()} seeded.`);
    }
  }
}
