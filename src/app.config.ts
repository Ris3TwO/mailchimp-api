import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ThrottlerExceptionFilter } from './mailchimp/filters/ThrottlerException.filter';

export const validationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
};

export function configureApp(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Mailchimp API')
    .setDescription('API para integración con Mailchimp')
    .setVersion('1.0')
    .addServer('/api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new ThrottlerExceptionFilter());
}
