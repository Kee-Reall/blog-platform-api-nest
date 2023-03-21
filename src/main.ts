import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { exceptionFactory } from './helpers';
import { GlobalHTTPFilter, appConfig } from './infrastructure';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.use(cookieParser());
  app.enableCors(appConfig.corsOptions);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: exceptionFactory,
    }),
  );
  app.useGlobalFilters(new GlobalHTTPFilter());
  await app.listen(appConfig.port, () =>
    console.log('Application port: ' + appConfig.port),
  );
}

bootstrap();
