import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PhoneNumber } from './phoneNumber.entity';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Contact extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    @ApiProperty({ description: 'The unique identifier of the contact' })
    id: string;

    @Column()
    @ApiProperty({ description: 'The name of the contact' })
    name: string;

    @ManyToOne(() => User, (user) => user.contacts)
    @ApiProperty({ type: () => User, description: 'The user associated with this contact' })
    user: User;

    @OneToMany(() => PhoneNumber, (phoneNumber) => phoneNumber.contact)
    @ApiProperty({ type: () => [PhoneNumber], description: 'List of phone numbers associated with this contact' })
    phoneNumbers: PhoneNumber[];
}
