import { Controller } from '@nestjs/common';
import { ContactsService } from './contacts.service';

@Controller()
export class ContactsController {
  constructor(private readonly service: ContactsService) {}
}
