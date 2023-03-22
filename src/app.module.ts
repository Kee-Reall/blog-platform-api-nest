import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { PostsModule } from './posts/posts.module';
import { BlogsModule } from './blogs/blogs.module';
import { AuthModule } from './auth/auth.module';
import { appConfig } from './Infrastructure';
import { TestingModule } from './Testing';
import { SuperAdminModule } from './SuperAdmin';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(appConfig.mongoUri),
    MailerModule.forRoot(appConfig.mailOptions),
    BlogsModule,
    PostsModule,
    TestingModule,
    AuthModule,
    SuperAdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
