import { Module } from '@nestjs/common';
import { BlogsModule } from './blogs/blogs.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { TestingModule } from './testing/testing.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    BlogsModule,
    PostsModule,
    UsersModule,
    TestingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
