import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from '../Model/Schema/post.schema';
import { Blog, BlogSchema } from '../Model/Schema/blog.schema';
import { PostsQueryRepository } from './repos/posts.query.repository';
import { Like, LikeSchema } from '../Model/Schema/like.schema';
import { PostsCommandRepository } from './repos/posts.command.repository';
import { CommentSchema } from '../Model/Schema/comment.schema';
import { CommentsController } from './comments.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Post.name, schema: CommentSchema },
    ]),
  ],
  controllers: [PostsController, CommentsController],
  providers: [PostsService, PostsQueryRepository, PostsCommandRepository],
})
export class PostsModule {}
