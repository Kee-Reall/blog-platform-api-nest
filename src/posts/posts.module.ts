import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';

import { PostsQueryRepository } from './repos/posts.query.repository';
import { PostsCommandRepository } from './repos/posts.command.repository';
import { CommentsController } from './comments.controller';
import {
  Blog,
  BlogSchema,
  CommentSchema,
  Like,
  LikeSchema,
  Post,
  PostSchema,
} from '../Model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [PostsController, CommentsController],
  providers: [PostsService, PostsQueryRepository, PostsCommandRepository],
})
export class PostsModule {}
