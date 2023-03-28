import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { PublicModule } from './Public';
import { BloggerModule } from './Blogger';
import { TestingModule } from './Testing';
import { SecurityModule } from './Security';
import { appConfig } from './Infrastructure';
import { SuperAdminModule } from './SuperAdmin';
import { PostsModule } from './posts/posts.module';
//import { BlogsModule } from './blogs/blogs.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(appConfig.mongoUri),
    MailerModule.forRoot(appConfig.mailOptions),
    //BlogsModule,
    PostsModule,
    PublicModule,
    TestingModule,
    SecurityModule,
    SuperAdminModule,
    BloggerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
