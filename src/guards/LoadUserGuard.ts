import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { UsersService } from 'src/services/users.service';

@Injectable()
export class LoadUserGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    console.log('LoadUserGuard:canActivate:', token);

    if (!token) {
      return false;
    }

    try {
      const decoded = this.jwtService.verify(token);
      let user = await this.usersService.findOneBy({ identity: decoded.identity });
      request.user = user;
      return true;
    } catch (e) {
      return false;
    }
  }
}