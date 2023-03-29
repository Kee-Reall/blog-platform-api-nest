import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from './posts.service';
import { SoftJwtGuard } from '../Infrastructure';
import { IsBlogExistConstraint } from './validators/isBlogExist.decorator';
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
    SoftJwtGuard,
    IsBlogExistConstraint,
  ],
})
export class PostsModule {}
