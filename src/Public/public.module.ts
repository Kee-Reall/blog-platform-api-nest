import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
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
import { HardJwtAuthStrategy, SoftJwtAuthGuard } from '../Infrastructure';

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
  controllers: [],
  providers: [SoftJwtAuthGuard, HardJwtAuthStrategy],
})
export class PublicModule {}
