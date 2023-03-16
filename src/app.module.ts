import { Module } from '@nestjs/common';
import { BlogsModule } from './blogs/blogs.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { TestingModule } from './testing/testing.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MailerModule.forRoot({
      transport: `smtps://${process.env.MAIL_NAME}:${process.env.MAIL_PASSWORD}@smtp.${process.env.MAIL_DOMAIN}`,
      defaults: {
        from: '"Blog-platform-api" <${process.env.MAIL_NAME}>',
      },
    }),
    BlogsModule,
    PostsModule,
    UsersModule,
    TestingModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
