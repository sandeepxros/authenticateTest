import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PhoneNumber } from './phoneNumber.entity';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class SpamReport extends BaseEntity{

    @PrimaryGeneratedColumn("uuid")
    @ApiProperty({ example: '1c047f42-fed1-46a9-a860-e04618502911', description: 'The unique identifier of the Spam Report' })
    id: string;

    @ManyToOne(() => User, (user) => user.spamReports)
    @ApiProperty({ type: () => User, description: 'The user who reported the spam' })
    user: User;

    @ManyToOne(() => PhoneNumber, (phoneNumber) => phoneNumber.spamReports)
    @ApiProperty({ type: () => PhoneNumber, description: 'Phone Number reported as spam' })
    phoneNumber: PhoneNumber;

    @Column()
    @ApiProperty({ description: 'Comment describing the spam report' })
    comment: string;
}
