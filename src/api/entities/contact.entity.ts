import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PhoneNumber } from './phoneNumber.entity';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Base } from './base.entity';

@Entity()
export class Contact extends Base {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'The unique identifier of the contact' })
  id: string;

  @Column()
  @ApiProperty({ description: 'The name of the contact' })
  name: string;

  @Column({nullable:true})
  @ApiProperty({ description: 'The email of the contact' })
  email?: string;

  @ManyToOne(() => User, (user) => user.contacts)
  @ApiProperty({
    type: () => User,
    description: 'The user added this contact',
  })
  addedBy: User;

  @OneToMany(() => PhoneNumber, (phoneNumber) => phoneNumber.contact)
  @ApiProperty({
    type: () => [PhoneNumber],
    description: 'List of phone numbers associated with this contact',
  })
  phoneNumbers: PhoneNumber[];

  @Column({ default: false })
  isRegistered: boolean;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @ApiProperty({
    type: () => User,
    description: 'The account of this user',
  })
  user: User;
}
