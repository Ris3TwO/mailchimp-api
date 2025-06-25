import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './app.config';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  configureApp(app);

  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

bootstrap().catch((err) => {
  console.error('Error starting application', err);
  process.exit(1);
});
