import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Base } from './base.entity';
import { PhoneNumber } from './phoneNumber.entity';
import { User } from './user.entity';

@Entity()
export class Contact extends Base {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'The unique identifier of the contact' })
  id: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'The first name of the contact' })
  firstName?: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'The last name of the contact' })
  lastName?: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'The email of the contact' })
  email?: string;

  @Column({ default: false })
  isRegistered: boolean;

  @ManyToOne(() => PhoneNumber, (phoneNumber) => phoneNumber.contact)
  @ApiProperty({
    type: () => PhoneNumber,
    description: 'phone number associated with this contact',
  })
  phoneNumbers: PhoneNumber;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @ApiProperty({
    type: () => User,
    description: 'The account of this user',
  })
  user: User;

  @ManyToOne(() => User, (user) => user.contacts)
  @ApiProperty({
    type: () => User,
    description: 'The user added this contact',
  })
  addedBy: User;
}
