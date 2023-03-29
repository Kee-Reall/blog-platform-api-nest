import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { HardJwtAuthStrategy, SoftJwtGuard } from '../Infrastructure';
import { useCases } from './useCases';
import { BlogsController, PostsController } from './controllers';
import { PublicCommandRepository, PublicQueryRepository } from './repos';
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
import { CommentsController } from './controllers/comments.controller';

@Module({
  imports: [
    CqrsModule,
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
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
