import { INestApplication } from '@nestjs/common';

jest.mock('@nestjs/swagger', () => ({
  SwaggerModule: {
    createDocument: jest.fn().mockReturnValue({}),
    setup: jest.fn(),
  },
  DocumentBuilder: jest.fn().mockImplementation(() => ({
    setTitle: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    setVersion: jest.fn().mockReturnThis(),
    addServer: jest.fn().mockReturnThis(),
    build: jest.fn().mockReturnValue({}),
  })),
}));

jest.mock('./mailchimp/filters/ThrottlerException.filter', () => ({
  ThrottlerExceptionFilter: jest.fn(),
}));

import { configureApp, validationPipeOptions } from './app.config';

describe('configureApp', () => {
  let mockApp: Partial<INestApplication>;
  let useGlobalPipesSpy: jest.Mock;

  beforeEach(() => {
    useGlobalPipesSpy = jest.fn();

    mockApp = {
      enableCors: jest.fn(),
      setGlobalPrefix: jest.fn(),
      useGlobalFilters: jest.fn(),
      useGlobalPipes: useGlobalPipesSpy,
    };
  });
  it('should configure the application correctly', () => {
    configureApp(mockApp as INestApplication);

    expect(mockApp.enableCors).toHaveBeenCalledWith({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
    expect(mockApp.setGlobalPrefix).toHaveBeenCalledWith('api');
    expect(mockApp.useGlobalFilters).toHaveBeenCalled();
  });

  it('should have correct validation pipe options', () => {
    expect(validationPipeOptions).toEqual({
      whitelist: true,
      forbidNonWhitelisted: true,
    });
  });

  it('should use ALLOWED_ORIGINS from env if available', () => {
    process.env.ALLOWED_ORIGINS = 'http://localhost,http://example.com';

    configureApp(mockApp as INestApplication);

    expect(mockApp.enableCors).toHaveBeenCalledWith({
      origin: ['http://localhost', 'http://example.com'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    delete process.env.ALLOWED_ORIGINS;
  });
});
