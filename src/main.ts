import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ThrottlerExceptionFilter } from './mailchimp/filters/ThrottlerException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Mailchimp API')
    .setDescription('API para integración con Mailchimp')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalFilters(new ThrottlerExceptionFilter());

  const PORT = process.env.PORT ?? 3000;

  await app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
bootstrap().catch((err) => {
  console.error('Error starting application', err);
  process.exit(1);
});
