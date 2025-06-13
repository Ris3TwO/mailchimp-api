import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Response } from 'express';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const res = exception.getResponse() as { retryAfter?: number; [key: string]: any };

    response.status(429).json({
      statusCode: 429,
      message: 'Demasiadas peticiones. Por favor intenta nuevamente más tarde.',
      retryAfter: res.retryAfter,
    });
  }
}
