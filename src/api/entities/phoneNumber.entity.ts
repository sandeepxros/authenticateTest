import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Base } from './base.entity';
import { Contact } from './contact.entity';
import { SpamReport } from './spamReport.entity';

export enum PhoneNumberLabel {
  home = 'home',
  work = 'work',
  mobile = 'mobile',
  primary = 'primary',
}

@Entity()
export class PhoneNumber extends Base {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: '1c047f42-fed1-46a9-a860-e04618502911',
    description: 'The unique identifier of the phone number',
  })
  id: string;

  @Column({ unique: true })
  @ApiProperty({
    example: '+1234567890',
    description: 'The phone number of the user (without country code)',
  })
  phoneNumber: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'US', description: 'The country code of the user' })
  countryCode?: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'US', description: 'The region code of the user' })
  regionCode?: string;

  @Column({ nullable: true })
  @ApiProperty({
    example: 'United States',
    description: 'The country name of the user',
  })
  countryName?: string;

  @OneToMany(() => Contact, (contact) => contact.phoneNumbers)
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

  @Column({ enum: PhoneNumberLabel, nullable: true })
  @ApiProperty({
    example: PhoneNumberLabel.home,
    enum: PhoneNumberLabel,
    description: 'The label of the phone number (home, work, mobile)',
  })
  label: PhoneNumberLabel;
}
