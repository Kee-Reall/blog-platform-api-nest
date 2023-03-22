import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { SoftJwtAuthGuard } from '../Infrastructure';
import { PostsService } from './posts.service';
import { PostsController, CommentsController } from './controllers';
import { PostsQueryRepository, PostsCommandRepository } from './repos';
import {
  Blog,
  BlogSchema,
  Comment,
  CommentSchema,
  Like,
  LikeSchema,
  Post,
  PostSchema,
  User,
  UserSchema,
} from '../Model';
import { IsBlogExistConstraint } from './validators/isBlogExist';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule.register({}),
  ],
  controllers: [PostsController, CommentsController],
  providers: [
    PostsService,
    PostsQueryRepository,
    PostsCommandRepository,
    SoftJwtAuthGuard,
    IsBlogExistConstraint,
  ],
})
export class PostsModule {}
