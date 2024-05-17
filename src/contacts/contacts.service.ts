import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpamReport } from '../entities/spamReport.entity';
import { GlobalPhoneBook } from '../entities/globalPhonebook.entity';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(GlobalPhoneBook)
    private readonly phonebookRepository: Repository<GlobalPhoneBook>,
    @InjectRepository(SpamReport)
    private readonly spamReportRepository: Repository<SpamReport>,
  ) {}

  register(user:GlobalPhoneBook){
    return this.phonebookRepository.insert(user)
  }

  markSpam() {}

  blockContact() {}

  searchPhonebook(){}
}
