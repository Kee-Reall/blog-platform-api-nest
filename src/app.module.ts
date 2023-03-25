import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { TestingModule } from './Testing';
import { appConfig } from './Infrastructure';
import { AuthModule } from './auth/auth.module';
import { SuperAdminModule } from './SuperAdmin';
import { PostsModule } from './posts/posts.module';
import { BlogsModule } from './blogs/blogs.module';
import { BloggerModule } from './Blogger/blogger.module';

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
    BloggerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
