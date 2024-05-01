
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Thread } from '../entities/thread.entity';
import { User } from 'src/entities/user.entity';
import { PaginationDto } from 'src/dto/PaginationDto';

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

  // thread and user has many to many relationship. please where to find list thread belong to user
  async findThreadsByUser(user: User, paginationDto: PaginationDto): Promise<Thread[]> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    let results = await this.threadRepository.createQueryBuilder('th')
      .leftJoinAndSelect('th.users', 'user')
      .where('user.id = :id', { id : user.id })
      // .skip(skip)
      // .take(limit)
      .orderBy('th.updatedAt', 'DESC')
      .getMany();

    console.log('findThreadByUser:results:', user.id, results, paginationDto);
    return results;
  }  


  async remove(id: number): Promise<void> {
    await this.threadRepository.delete(id);
  }

  async create(title: string, threadUuid: string, userId: string): Promise<Thread> {
    let user = await this.userRepository.findOneBy({ identity: userId });
    let thread = await this.threadRepository.findOneBy({ uuid: threadUuid });
    console.log('createThread:user:', threadUuid, thread);
    // if (!thread) {
    //     const thread = new Thread();
    //     thread.title = title;
    //     thread.uuid = threadUuid;
    //     thread.owner = user;
    //     return await this.threadRepository.save(thread);
    // }

    return thread;
  }
}