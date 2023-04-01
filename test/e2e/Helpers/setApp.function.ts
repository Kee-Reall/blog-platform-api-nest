import { ConfigModule } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicModule } from '../../../src/Public';
import { BloggerModule } from '../../../src/Blogger';
import { Test, TestingModule } from '@nestjs/testing';
import { MailerModule } from '@nestjs-modules/mailer';
import { SecurityModule } from '../../../src/Security';
import { appConfig } from '../../../src/Infrastructure';
import { SuperAdminModule } from '../../../src/SuperAdmin';
import { TestingModule as AppTestingModule } from '../../../src/Testing';

async function setApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot(),
      MongooseModule.forRoot(appConfig.mongoUriForTest),
      MailerModule.forRoot(appConfig.mailOptions),
      PublicModule,
      AppTestingModule,
      SecurityModule,
      SuperAdminModule,
      BloggerModule,
    ],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();
  return app;
}

export const applicationPromise = setApp();
