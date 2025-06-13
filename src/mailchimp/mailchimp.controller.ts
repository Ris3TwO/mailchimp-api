import { Controller, Post, Body } from '@nestjs/common';
import { MailchimpService } from './mailchimp.service';
import { SubscribeDto } from './dto/subscribe/subscribe.dto';

@Controller('mailchimp')
export class MailchimpController {
  constructor(private readonly mailchimpService: MailchimpService) {}

  @Post('subscribe')
  async subscribe(@Body() subscribeDto: SubscribeDto) {
    return this.mailchimpService.subscribe(subscribeDto);
  }
}
