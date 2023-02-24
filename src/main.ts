import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 5000;
  app.enableCors({
    credentials: true,
    origin: process.env.FRONEND_DOMAIN ?? 'http//localhost:3000/',
  });
  await app.listen(port, () => console.log('Application port: ' + port));
}

bootstrap();
