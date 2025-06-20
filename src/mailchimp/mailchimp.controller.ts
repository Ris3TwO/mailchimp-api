import { Controller, Post, Body, Get } from '@nestjs/common';
import { MailchimpService } from './mailchimp.service';
import { SubscribeDto } from './dto/subscribe/subscribe.dto';

@Controller('mailchimp')
export class MailchimpController {
  constructor(private readonly mailchimpService: MailchimpService) {}

  @Get()
  getHello() {
    return { message: 'The backend is working as expected!' };
  }

  @Post('subscribe')
  async subscribe(@Body() subscribeDto: SubscribeDto) {
    return this.mailchimpService.subscribe(subscribeDto);
  }
}
