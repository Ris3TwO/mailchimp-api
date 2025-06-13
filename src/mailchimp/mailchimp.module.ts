import { Module } from '@nestjs/common';
import { MailchimpService } from './mailchimp.service';
import { MailchimpController } from './mailchimp.controller';

@Module({
  providers: [MailchimpService],
  controllers: [MailchimpController],
})
export class MailchimpModule {}
