import * as bcrypt from 'bcrypt';
import { BeforeInsert, Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { DefaultEntity } from './default.entity';
import { Message } from './message.entity';
import { Thread } from './thread.entity';

@Entity('users')
export class User extends DefaultEntity {

  // use for anonymous user, uuid or email.
  @Column({ unique: true, nullable: true})
  identity: string;

  @Column({ select: true })
  password: string;

  @Column({
    name: 'name',
  })
  name: string;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @OneToMany(() => Message, message => message.user)
  messages: Message[];

  @ManyToMany(() => Thread, thread => thread.users)
  threads: Thread[];
}