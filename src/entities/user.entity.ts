import * as bcrypt from 'bcrypt';
import { BeforeInsert, Column, Entity } from 'typeorm';
import { DefaultEntity } from './default.entity';

@Entity('users')
export class User extends DefaultEntity {
  @Column({ unique: true })
  email: string;

  @Column({ select: true })
  password: string;

  @Column({ select: false, nullable: true, name: 'refresh_token' })
  refreshToken: string;

  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  // @Column({
  //   type: 'enum',
  //   enum: Role,
  //   default: Role.CUSTOMER,
  // })
  // role: Role;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}