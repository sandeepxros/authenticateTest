import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Base } from './base.entity';
import { Contact } from './contact.entity';
import { SpamReport } from './spamReport.entity';

@Entity()
export class User extends Base {
  private tempPassword: string;

  @PrimaryGeneratedColumn("uuid")
  @ApiProperty({ example: '1c047f42-fed1-46a9-a860-e04618502911', description: 'The unique identifier of the user' })
  id: string;

  @Column()
  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  firstName: string;

  @Column()
  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  lastName: string;

  @Column({ unique: true })
  @ApiProperty({ example: '+1234567890', description: 'The phone number of the user' })
  phoneNumber: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'john.doe@example.com', description: 'The email address of the user' })
  email?: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'US', description: 'The country code of the user' })
  countryCode?: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'US', description: 'The region code of the user' })
  regionCode?: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'United States', description: 'The country name of the user' })
  countryName?: string;

  @Column({ default: true })
  @ApiProperty({ example: true, description: 'Indicates whether the user account is active or not' })
  isActive: boolean;

  @Column()
  password: string;

  @OneToMany(() => Contact, (contact) => contact.user)
  @ApiProperty({ type: () => [Contact], description: 'List of contacts associated with the user' })
  contacts: Contact[];

  @OneToMany(() => SpamReport, (spamReport) => spamReport.user)
  @ApiProperty({ type: () => [SpamReport], description: 'List of spam reports made by the user' })
  spamReports: SpamReport[];
  
  @AfterLoad()
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.tempPassword !== this.password) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }
}
