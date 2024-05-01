import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { AuthService } from 'src/services/auth.service';

@Injectable()
export class UserSeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async seed() {
    // Check if users already exist
    const usersExist = await this.userRepository.count();
    if (usersExist) {
      console.log('Users already seeded.');
      return;
    }

    // Seed users
    const usersToCreate = [
      { identity: 'user1@example.com', password: 'password1', name: 'User 1' },
      { identity: 'user2@example.com', password: 'password2', name: 'User 2' },
    ];

    for (const userData of usersToCreate) {
      const user = new User();
      user.identity = userData.identity;
      user.password = userData.password;
      user.name = userData.name;
      await this.userRepository.save(user);

      console.log(`User ${userData.identity} seeded.`);
    }
  }
}
