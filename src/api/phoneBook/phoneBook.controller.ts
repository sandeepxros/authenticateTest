import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { UserPayload } from 'src/config/common/types/user.type';
import { User } from 'src/config/decorators/user.decorator';
import { Contact } from '../entities/contact.entity';
import {
  CreateContactDto,
  CreateMultipleContactsDto,
  CreateSpamReportDto,
} from './dto/phoneBook.dto';
import { PhoneBookService } from './phonebook.service';

@ApiBearerAuth()
@Controller('phoneBook')
@ApiTags('PhoneBook')
export class PhoneBookController {
  constructor(private readonly service: PhoneBookService) {}

  @Post('addSingleContact')
  @ApiOperation({ summary: 'Add a single contact' })
  @ApiResponse({
    status: 201,
    description: 'The contact has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  addSingleContact(
    @Body() createContactDto: CreateContactDto,
    @User() user: UserPayload,
  ) {
    return this.service.addContact(user.uId, createContactDto);
  }

  @Get('getAllContacts')
  @ApiOperation({ summary: 'Get all contacts' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit of items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of contacts',
    type: Pagination<Contact>,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getAllContacts(
    @User() user: UserPayload,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const options: IPaginationOptions = {
      page,
      limit,
    };
    return this.service.getAllContacts(user.uId, options);
  }

  @Post('addMultipleContact')
  @ApiOperation({ summary: 'Add multiple contacts' })
  @ApiResponse({
    status: 201,
    description: 'The contacts have been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  addMultipleContacts(
    @Body() createMultipleContactsDto: CreateMultipleContactsDto,
    @User() user: UserPayload,
  ) {
    return this.service.addMultipleContacts(
      user.uId,
      createMultipleContactsDto.contacts,
    );
  }

  @Post('markAsSpam')
  @ApiOperation({ summary: 'Mark a phone number as spam' })
  @ApiResponse({
    status: 201,
    description: 'The phone number has been marked as spam.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async markAsSpam(
    @Body() createSpamReportDto: CreateSpamReportDto,
    @User() user: UserPayload,
  ) {
    return this.service.markAsSpam(
      user.uId,
      createSpamReportDto.number,
      createSpamReportDto.comment,
    );
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search contacts by name or phone number with pagination',
  })
  @ApiQuery({
    name: 'query',
    required: true,
    description: 'Search query string',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit of items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of contacts',
    type: Pagination<Contact>,
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameter' })
  async searchContacts(
    @Query('query') query: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @User() user?: UserPayload,
  ) {
    const options: IPaginationOptions = {
      page,
      limit,
    };
    return this.service.searchContacts(query, options, user.uId);
  }
}
