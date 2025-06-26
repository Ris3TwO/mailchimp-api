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

import { configureApp } from './app.config';

describe('configureApp', () => {
  it('should configure the application correctly', () => {
    const enableCors = jest.fn();
    const setGlobalPrefix = jest.fn();
    const useGlobalFilters = jest.fn();

    const mockApp = {
      enableCors,
      setGlobalPrefix,
      useGlobalFilters,
    } as unknown as INestApplication;

    configureApp(mockApp);

    expect(enableCors).toHaveBeenCalledWith({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
    expect(setGlobalPrefix).toHaveBeenCalledWith('api');
    expect(useGlobalFilters).toHaveBeenCalled();
  });
});
