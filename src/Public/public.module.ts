import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { useCases } from './useCases';
import { IsBlogBanByCommentGuard } from './guards';
import { HardJwtAuthStrategy, SoftJwtGuard } from '../Base';
import { PublicCommandRepository, PublicQueryRepository } from './repos';
import {
  BlogsController,
  CommentsController,
  PostsController,
} from './controllers';
import {
  Ban,
  BanSchema,
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
    CqrsModule,
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: Ban.name, schema: BanSchema },
      { name: Post.name, schema: PostSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Like.name, schema: LikeSchema },
      { name: User.name, schema: UserSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [BlogsController, CommentsController, PostsController],
  providers: [
    SoftJwtGuard,
    HardJwtAuthStrategy,
    PublicQueryRepository,
    PublicCommandRepository,
    IsBlogBanByCommentGuard,
    ...useCases,
  ],
})
export class PublicModule {}
