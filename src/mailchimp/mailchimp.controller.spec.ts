import { Test, TestingModule } from '@nestjs/testing';
import { MailchimpController } from './mailchimp.controller';

describe('MailchimpController', () => {
  let controller: MailchimpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailchimpController],
    }).compile();

    controller = module.get<MailchimpController>(MailchimpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
