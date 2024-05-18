import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Base } from './base.entity';
import { Contact } from './contact.entity';
import { PhoneNumber } from './phoneNumber.entity';
import { SpamReport } from './spamReport.entity';

@Entity()
export class User extends Base {
  private tempPassword: string;

  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: '1c047f42-fed1-46a9-a860-e04618502911',
    description: 'The unique identifier of the user',
  })
  id: string;

  @Column({ default: true })
  @ApiProperty({
    example: true,
    description: 'Indicates whether the user account is active or not',
  })
  isActive: boolean;

  @Column()
  password: string;

  @Column()
  phoneId:string;

  @OneToOne(() => Contact, (contact) => contact.user)
  @ApiProperty({ type: () => Contact, description: 'Description of the user' })
  userProfile: Contact;

  @OneToMany(() => SpamReport, (spamReport) => spamReport.reportedBy)
  @ApiProperty({
    type: () => [SpamReport],
    description: 'List of spam reports made by the user',
  })
  spamReports: SpamReport[];

  @OneToMany(() => Contact, (contact) => contact.addedBy)
  @ApiProperty({
    type: () => [Contact],
    description: 'User contacts',
  })
  contacts: Contact[];

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
