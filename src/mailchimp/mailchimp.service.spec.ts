import { Test } from '@nestjs/testing';
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { MailchimpService } from './mailchimp.service';
import { SubscribeDto } from './dto/subscribe/subscribe.dto';
import { MailchimpResponse } from './interfaces';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

function mockSuccessfulMailchimpResponse(
  overrides: Partial<MailchimpResponse> = {},
): AxiosResponse<MailchimpResponse> {
  const mockConfig = {
    url: 'https://mock-url.com',
    method: 'post',
    headers: {},
  } as InternalAxiosRequestConfig;

  return {
    data: {
      id: 'mock-id',
      email_address: 'mock@example.com',
      status: 'subscribed',
      merge_fields: {
        FNAME: '',
        LNAME: '',
      },
      ...overrides,
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: mockConfig, // Sin `as any`
    request: {},
  };
}

describe('MailchimpService', () => {
  let service: MailchimpService;
  let postSpy: jest.SpyInstance;

  beforeEach(async () => {
    process.env.MAILCHIMP_API_KEY = 'test-api-key-us1';
    process.env.MAILCHIMP_SERVER_PREFIX = 'us1';
    process.env.MAILCHIMP_AUDIENCE_ID = 'test-audience-id';

    const module = await Test.createTestingModule({
      providers: [MailchimpService],
    }).compile();

    service = module.get<MailchimpService>(MailchimpService);

    postSpy = jest.spyOn(mockedAxios, 'post');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('subscribe()', () => {
    const validDto: SubscribeDto = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      tags: ['customer'],
      language: 'en',
    };

    it('should subscribe successfully', async () => {
      postSpy.mockResolvedValue(mockSuccessfulMailchimpResponse());

      const result = await service.subscribe(validDto);

      expect(result.success).toBe(true);
      expect(postSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle optional fields', async () => {
      const minimalDto: SubscribeDto = {
        email: 'minimal@example.com',
      };

      const postSpy = jest.spyOn(axios, 'post').mockResolvedValue({
        data: { id: 'minimal-id' },
      });

      await service.subscribe(minimalDto);

      expect(postSpy).toHaveBeenCalledWith(
        expect.any(String),
        {
          email_address: 'minimal@example.com',
          status: 'subscribed',
          merge_fields: {
            FNAME: '',
            LNAME: '',
          },
          tags: [],
          language: '',
        },
        expect.any(Object),
      );
    });

    it('should throw an error if email is missing in subscribeDto', async () => {
      const invalidDto = {
        firstName: 'NoEmail',
      } as SubscribeDto;

      await expect(service.subscribe(invalidDto)).rejects.toThrow('Email is required');
    });

    describe('error handling', () => {
      it('should handle AxiosError with response', async () => {
        const errorResponse = {
          response: {
            status: 400,
            data: {
              title: 'Invalid Resource',
              detail: 'Email already exists',
            },
          },
          isAxiosError: true,
          message: 'Request failed with status code 400',
        };

        mockedAxios.post.mockRejectedValue(errorResponse);

        const result = await service.subscribe(validDto);

        expect(result).toEqual({
          success: false,
          error: {
            message: 'Request failed with status code 400',
            response: {
              title: 'Invalid Resource',
              detail: 'Email already exists',
            },
            statusCode: 400,
          },
        });
      });

      it('should handle AxiosError without response', async () => {
        const networkError = {
          isAxiosError: true,
          message: 'Network Error',
        };

        mockedAxios.post.mockRejectedValue(networkError);

        const result = await service.subscribe(validDto);

        expect(result).toEqual({
          success: false,
          error: {
            message: 'Network Error',
            response: undefined,
            statusCode: undefined,
          },
        });
      });

      it('should handle generic Error', async () => {
        const genericError = new Error('Some unexpected error');
        mockedAxios.post.mockRejectedValue(genericError);

        const result = await service.subscribe(validDto);

        expect(result).toEqual({
          success: false,
          error: {
            message: 'Some unexpected error',
          },
        });
      });

      it('should handle unknown error type', async () => {
        mockedAxios.post.mockRejectedValue('Not an error object');

        const result = await service.subscribe(validDto);

        expect(result).toEqual({
          success: false,
          error: {
            message: 'Unknown error occurred',
          },
        });
      });
    });
  });

  describe('isAxiosError()', () => {
    it('should correctly identify AxiosError', () => {
      const axiosError = {
        isAxiosError: true,
      };
      expect(service['isAxiosError'](axiosError)).toBe(true);
    });

    it('should reject non-AxiosError', () => {
      const regularError = new Error('Regular error');
      expect(service['isAxiosError'](regularError)).toBe(false);
    });
  });
});
