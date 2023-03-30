import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { useCases } from './useCases';
import { PublicCommandRepository, PublicQueryRepository } from './repos';
import {
  BlogsController,
  CommentsController,
  PostsController,
} from './controllers';
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
import { HardJwtAuthStrategy, SoftJwtGuard } from '../Base';

@Module({
  imports: [
    CqrsModule,
    JwtModule.register({}),
    MongooseModule.forFeature([
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
    ...useCases,
  ],
})
export class PublicModule {}
