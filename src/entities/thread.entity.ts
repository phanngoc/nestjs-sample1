import { Entity, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { DefaultEntity } from './default.entity';
import { Message } from './message.entity';
import { User } from './user.entity';
 
@Entity({name: 'threads'})
export class Thread extends DefaultEntity {
  @Column()
  title: string;

  @Column()
  uuid: string;

  @OneToMany(() => Message, message => message.thread)
  messages: Message[];
 
  @ManyToMany(() => User, user => user.threads)
  @JoinTable()
  users: User[];

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'ownerId' })
  owner: User;
 }