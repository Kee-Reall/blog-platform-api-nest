import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from '../Model/Schema/blog.schema';
import { BlogsQueryRepository } from './repos/blogs.query.repository';
import { BlogsCommandRepository } from './repos/blogs.command.repository';
import { Post, PostSchema } from '../Model/Schema/post.schema';
import { Like, LikeSchema } from '../Model/Schema/like.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Like.name, schema: LikeSchema },
    ]),
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsQueryRepository, BlogsCommandRepository],
})
export class BlogsModule {}
