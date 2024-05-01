import { Entity, Column, ManyToOne } from 'typeorm';
import { DefaultEntity } from './default.entity';
import { User } from './user.entity';
import { Thread } from './thread.entity';

@Entity({name: 'messages'})
export class Message extends DefaultEntity {
  @Column()
  content: string;

  @Column({ nullable: true })
  userId: number;

  /** write code include realtion user with message. */
  @ManyToOne(() => User, user => user.messages)
  user: User;

  /** write code include realtion thread with message. */
  @ManyToOne(() => Thread, thread => thread.messages)
  thread: Thread;
}