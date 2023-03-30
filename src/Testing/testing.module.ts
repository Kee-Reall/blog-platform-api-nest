import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
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
  Session,
  SessionSchema,
  User,
  UserSchema,
} from '../Model/';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Like.name, schema: LikeSchema },
      { name: User.name, schema: UserSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
  ],
  controllers: [TestingController],
})
export class TestingModule {}
