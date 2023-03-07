import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalHTTPFilter } from './app.filter';
import { exceptionFactory } from './helpers/functions/exceptionFactory.function';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 5000;
  app.enableCors({
    credentials: true,
    origin: process.env.FRONTEND_DOMAIN ?? 'http//localhost:3000/',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: exceptionFactory,
    }),
  );
  app.useGlobalFilters(new GlobalHTTPFilter());
  await app.listen(port, () => console.log('Application port: ' + port));
}

bootstrap();
