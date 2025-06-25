import { Test, TestingModule } from '@nestjs/testing';
import { MailchimpController } from './mailchimp.controller';
import { MailchimpService } from './mailchimp.service';
import { SubscribeDto } from './dto/subscribe/subscribe.dto';
import { MailchimpResponse } from './interfaces';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

describe('MailchimpController', () => {
  let controller: MailchimpController;
  let mailchimpService: MailchimpService;

  const mockMailchimpResponse: MailchimpResponse = {
    id: '123',
    email_address: 'test@example.com',
    status: 'subscribed',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailchimpController],
      providers: [
        {
          provide: MailchimpService,
          useValue: {
            subscribe: jest.fn().mockResolvedValue({
              success: true,
              data: mockMailchimpResponse,
              error: undefined,
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<MailchimpController>(MailchimpController);
    mailchimpService = module.get<MailchimpService>(MailchimpService);
    jest.clearAllMocks();
  });

  describe('GET /v1/mailchimp', () => {
    it('should return welcome message', () => {
      const result = controller.getHello();
      expect(result).toEqual({
        message: 'The backend is working as expected!',
      });
    });
  });

  describe('POST /v1/mailchimp/subscribe', () => {
    it('should call service.subscribe with correct parameters', async () => {
      const mockDto: SubscribeDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        tags: ['newsletter'],
        language: 'en',
      };

      const subscribeSpy = jest.spyOn(mailchimpService, 'subscribe').mockResolvedValue({
        success: true,
        data: {
          id: '123',
        } as MailchimpResponse,
        error: undefined,
      });

      await controller.subscribe(mockDto);

      expect(subscribeSpy).toHaveBeenCalledWith(mockDto);
    });

    it('should handle service errors', async () => {
      const mockDto: SubscribeDto = {
        email: 'test@example.com',
      };

      const subscribeSpy = jest
        .spyOn(mailchimpService, 'subscribe')
        .mockRejectedValue(new Error('Mailchimp error'));

      await expect(controller.subscribe(mockDto)).rejects.toThrow('Mailchimp error');

      expect(subscribeSpy).toHaveBeenCalledWith(mockDto);
    });

    it('should validate input DTO using ValidationPipe', async () => {
      const pipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true });
      const invalidDto = {
        email: 'not-an-email',
        firstName: 123,
        lastName: true,
        tags: [123],
      };

      await expect(
        pipe.transform(invalidDto, { type: 'body', metatype: SubscribeDto }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
