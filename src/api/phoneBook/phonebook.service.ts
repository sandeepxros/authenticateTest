import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { Contact } from '../entities/contact.entity';
import { PhoneNumber } from '../entities/phoneNumber.entity';
import { SpamReport } from '../entities/spamReport.entity';
import { User } from '../entities/user.entity';
import { CreateContactDto } from './dto/phoneBook.dto';
import { PhoneNumberService } from 'src/config/common/services/utility/phoneNumber.service';

@Injectable()
export class PhoneBookService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    @InjectRepository(PhoneNumber)
    private phoneNumberRepository: Repository<PhoneNumber>,
    @InjectRepository(SpamReport)
    private spamReportRepository: Repository<SpamReport>,
    private phoneNumberService: PhoneNumberService,
  ) {}

  async addContact(
    userId: string,
    createContactDto: CreateContactDto,
    isRegistered = false,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const contact = this.contactRepository.create({
      name: createContactDto.name,
      addedBy: user,
      email: createContactDto.email,
      isRegistered,
      user,
    });
    await this.contactRepository.save(contact);

    const phoneNumbers = createContactDto.phoneNumbers.map((p) => ({
      contact,
      ...p,
    }));

    await this.phoneNumberRepository.insert(phoneNumbers);

    return { message: 'The contact has been successfully created.' };
  }

  async getAllContacts(userId: string, options: IPaginationOptions) {
    const query = this.contactRepository
      .createQueryBuilder('cr')
      .leftJoinAndSelect('cr.phoneNumbers', 'phoneNumbers')
      .where('cr.userId = :userId', { userId });

    return paginate(query, options);
  }

  async addMultipleContacts(
    userId: string,
    createContactDtos: CreateContactDto[],
  ) {
    const contacts = [];
    for (const createContactDto of createContactDtos) {
      const contact = this.addContact(userId, createContactDto);
      contacts.push(contact);
    }
    return Promise.allSettled(contacts);
  }

  async markAsSpam(userId: string, phoneNumber: string, comment: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    const isPhoneNumberAvailable = await this.phoneNumberRepository.findOne({
      where: { number: phoneNumber },
    });

    if (!isPhoneNumberAvailable) {
      throw new BadRequestException('Phone number not found');
    }
    const spamReport = this.spamReportRepository.create();
    spamReport.user = user;
    spamReport.comment = comment;
    spamReport.phoneNumber = isPhoneNumberAvailable;
    spamReport.save();
    return { message: 'The phone number has been marked as spam.' };
  }

  async getSpamReports(number: string) {
    const phoneNumber = await this.phoneNumberRepository.findOne({
      where: { number },
      relations: ['spamReports', 'spamReports.user'],
    });
    if (!phoneNumber) {
      throw new Error('Phone number not found');
    }
    return phoneNumber.spamReports;
  }

  async searchContacts(search: string, userId: string) {
    const contactResult = await this.contactRepository
      .createQueryBuilder('contact')
      .leftJoinAndSelect('contact.phoneNumbers', 'phoneNumbers')
      .leftJoinAndSelect('phoneNumbers.spamReports', 'spamReports')
      .addSelect('contact.userId')
      .addSelect('contact.email')
      .where(
        '(phoneNumbers.number LIKE :search OR contact.name ILIKE :search)',
        { search: `%${search}%` },
      )
      .orderBy('CASE WHEN contact.userId = :userId THEN 0 ELSE 1 END', 'ASC')
      .addOrderBy('contact.isRegistered', 'DESC')
      .setParameters({ search: `%${search}%`, userId })
      .getMany();

    const isValidPhoneNumber = this.phoneNumberService.isValidNumber(search);

    if (isValidPhoneNumber) {
      return contactResult.filter((r) => r.isRegistered).length
        ? contactResult.filter((r) => r.isRegistered)
        : contactResult;
    } else {
      return contactResult;
    }
  }

  async getContactInfo(contactId: string, userId: string) {
    const contactInfo = await this.contactRepository.findOne({
      where: { id: contactId },
      relations: ['phoneNumbers', 'phoneNumbers.spamReports', 'addedBy'],
    });
    if (contactInfo.addedBy.id !== userId && !contactInfo.isRegistered) {
      delete contactInfo.email;
    }
    delete contactInfo.addedBy;
    return contactInfo;
  }
}
