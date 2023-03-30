import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { appConfig } from './Infrastructure';
import { GlobalHTTPFilter } from './Base';
import { AppModule } from './app.module';

export async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  useContainer(app.select(AppModule), appConfig.globalContainerOptions);
  app.use(cookieParser());
  app.enableCors(appConfig.corsOptions);
  app.useGlobalPipes(new ValidationPipe(appConfig.globalValidatorOptions));
  app.useGlobalFilters(new GlobalHTTPFilter());
  await app.listen(appConfig.port, () =>
    console.log('App listen: ' + appConfig.port),
  );
}

bootstrap();
