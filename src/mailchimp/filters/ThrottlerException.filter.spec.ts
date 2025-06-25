import { Test } from '@nestjs/testing';
import { ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { ThrottlerException } from '@nestjs/throttler';
import { ThrottlerExceptionFilter } from './ThrottlerException.filter';

describe('ThrottlerExceptionFilter', () => {
  let filter: ThrottlerExceptionFilter;
  let mockResponse: Partial<Response>;
  let mockHost: ArgumentsHost;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ThrottlerExceptionFilter],
    }).compile();

    filter = module.get<ThrottlerExceptionFilter>(ThrottlerExceptionFilter);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse as Response,
      }),
    } as ArgumentsHost;
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('when catching ThrottlerException', () => {
    it('should set 429 status and proper message', () => {
      const exception = new ThrottlerException('Too Many Requests');

      exception.getResponse = jest.fn().mockReturnValue({
        message: 'ThrottlerException: Too Many Requests',
        retryAfter: 30,
      });

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(429);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 429,
        message: 'Demasiadas peticiones. Por favor intenta nuevamente más tarde.',
        retryAfter: 30,
      });
    });

    it('should handle undefined retryAfter', () => {
      const exception = new ThrottlerException('Rate limit exceeded');

      jest.spyOn(exception, 'getResponse').mockReturnValue({
        statusCode: 429,
        message: 'Rate limit exceeded',
      });

      filter.catch(exception, mockHost);

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 429,
        message: 'Demasiadas peticiones. Por favor intenta nuevamente más tarde.',
        retryAfter: undefined,
      });
    });
  });

  describe('when catching ThrottlerException', () => {
    it('should handle response with retryAfter', () => {
      const exception = new ThrottlerException('Too Many Requests');
      jest.spyOn(exception, 'getResponse').mockReturnValue({
        retryAfter: 30,
        message: 'Custom throttle message',
      });

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(429);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 429,
        message: 'Demasiadas peticiones. Por favor intenta nuevamente más tarde.',
        retryAfter: 30,
      });
    });

    it('should handle string response without retryAfter', () => {
      const exception = new ThrottlerException('Simple message');

      filter.catch(exception, mockHost);

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 429,
        message: 'Demasiadas peticiones. Por favor intenta nuevamente más tarde.',
        retryAfter: undefined,
      });
    });
  });

  it('should handle response format without retryAfter', () => {
    const exception = new ThrottlerException('Custom throttle message');

    jest.spyOn(exception, 'getResponse').mockReturnValue({
      message: 'Custom throttle message',
    });

    filter.catch(exception, mockHost);

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 429,
        message: 'Demasiadas peticiones. Por favor intenta nuevamente más tarde.',
        retryAfter: undefined,
      }),
    );
  });
});
