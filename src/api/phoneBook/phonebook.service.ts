import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { PhoneNumberService } from 'src/config/common/services/utility/phoneNumber.service';
import { Repository } from 'typeorm';
import { Contact } from '../entities/contact.entity';
import { PhoneNumber } from '../entities/phoneNumber.entity';
import { SpamReport } from '../entities/spamReport.entity';
import { User } from '../entities/user.entity';
import { CreateContactDto } from './dto/phoneBook.dto';

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
    const actualNumber = this.phoneNumberService.extractCountryDetails(
      createContactDto.phoneNumber.number,
    );
    let phoneNumber = await this.phoneNumberRepository.findOneBy({
      phoneNumber: actualNumber.phoneNumber,
    });
    if (!phoneNumber) {
      phoneNumber = this.phoneNumberRepository.create({
        ...createContactDto.phoneNumber,
        ...actualNumber,
      });
      await phoneNumber.save();
    }
    const contact = this.contactRepository.create({
      firstName: createContactDto.firstName,
      lastName: createContactDto.lastName,
      addedBy: user,
      email: createContactDto.email,
      isRegistered,
      phoneNumbers: phoneNumber,
    });
    await contact.save();

    return { message: 'The contact has been successfully created.' };
  }

  async getAllContacts(userId: string, options: IPaginationOptions) {
    const query = this.contactRepository
      .createQueryBuilder('cr')
      .leftJoinAndSelect('cr.phoneNumbers', 'phoneNumbers')
      .where('cr.addedBy = :userId', { userId })
      .andWhere('cr.phoneNumbers is not null')
      .andWhere('cr.userId is Null');

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
      where: { ...this.phoneNumberService.extractCountryDetails(phoneNumber) },
    });

    if (!isPhoneNumberAvailable) {
      throw new BadRequestException('Phone number not found');
    }
    const spamReport = this.spamReportRepository.create();
    spamReport.reportedBy = user;
    spamReport.comment = comment;
    spamReport.phoneNumber = isPhoneNumberAvailable;
    spamReport.save();

    return { message: 'The phone number has been marked as spam.' };
  }

  async searchContacts(search: string, userId: string) {
    const isValidPhoneNumber = this.phoneNumberService.isValidNumber(search);
    let localeNumber;
    if (isValidPhoneNumber)
      localeNumber =
        this.phoneNumberService.extractCountryDetails(search).phoneNumber;

    const contactResult = await this.contactRepository
      .createQueryBuilder('contact')
      .leftJoinAndSelect('contact.phoneNumbers', 'phoneNumbers')
      .where(
        'phoneNumbers.phoneNumber LIKE :search or phoneNumbers.phoneNumber LIKE :localeNumber',
        { search: `%${search}%`, localeNumber: `%${localeNumber}%` },
      )
      .orWhere('contact.firstName ILIKE :search', { search: `%${search}%` })
      .orWhere('contact.lastName ILIKE :search', { search: `%${search}%` })
      .getMany();

    contactResult.forEach((d) => {
      delete d.email;
    });
    if (isValidPhoneNumber) {
      const result = contactResult.filter((r) => r.isRegistered);
      return result.length ? result : contactResult;
    } else {
      return contactResult;
    }
  }

  async getContactInfo(contactId: string, phoneNumber: string) {
    if (!isUUID(contactId)) {
      throw new BadRequestException('contact ID should be valid');
    }
    const contactInfo = await this.contactRepository.findOne({
      where: { id: contactId },
      relations: [
        'phoneNumbers',
        'phoneNumbers.spamReports',
        'addedBy',
        'user.contacts',
        'user.contacts.phoneNumbers',
      ],
    });
    if (
      !contactInfo?.user?.contacts.find(
        (d) => d?.phoneNumbers?.phoneNumber === phoneNumber,
      ) &&
      !contactInfo.isRegistered
    ) {
      delete contactInfo.email;
    }
    delete contactInfo.addedBy;
    delete contactInfo.user;
    return contactInfo;
  }
}
