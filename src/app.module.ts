import { Module } from '@nestjs/common';
import { BlogsModule } from './blogs/blogs.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BlogsModule,
    PostsModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
