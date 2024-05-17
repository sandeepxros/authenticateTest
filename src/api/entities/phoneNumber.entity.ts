import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Contact } from './contact.entity';
import { SpamReport } from './spamReport.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum PhoneNumberLabel {
  home = 'home',
  work = 'work',
  mobile = 'mobile',
}

@Entity()
export class PhoneNumber extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: '1c047f42-fed1-46a9-a860-e04618502911',
    description: 'The unique identifier of the phone number',
  })
  id: string;

  @Column()
  @ApiProperty({ example: '+1234567890', description: 'The phone number' })
  number: string;

  @Column({ enum: PhoneNumberLabel })
  @ApiProperty({
    example: PhoneNumberLabel.home,
    enum: PhoneNumberLabel,
    description: 'The label of the phone number (home, work, mobile)',
  })
  label: PhoneNumberLabel;

  @ManyToOne(() => Contact, (contact) => contact.phoneNumbers)
  @ApiProperty({
    type: () => Contact,
    description: 'The contact associated with this phone number',
  })
  contact: Contact;

  @OneToMany(() => SpamReport, (spamReport) => spamReport.phoneNumber)
  @ApiProperty({
    type: () => [SpamReport],
    description: 'List of spam reports associated with this phone number',
  })
  spamReports: SpamReport[];
}
