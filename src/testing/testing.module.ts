import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from '../Model/Schema/post.schema';
import { Blog, BlogSchema } from '../Model/Schema/blog.schema';
import { Like, LikeSchema } from '../Model/Schema/like.schema';
import { Comment, CommentSchema } from '../Model/Schema/comment.schema';
import { User, UserSchema } from '../Model/Schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [TestingController],
})
export class TestingModule {}
