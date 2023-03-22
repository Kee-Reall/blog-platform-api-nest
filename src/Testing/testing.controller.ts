import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Blog,
  BlogDocument,
  CommentDocument,
  Comment,
  Like,
  LikeDocument,
  Post,
  PostDocument,
  User,
  UserDocument,
} from '../Model';

@Controller('api/testing')
export class TestingController {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  @Delete('all-data')
  @HttpCode(204)
  public async clear() {
    await Promise.all([
      this.postModel.deleteMany({}),
      this.blogModel.deleteMany({}),
      this.likeModel.deleteMany({}),
      this.commentModel.deleteMany({}),
      this.userModel.deleteMany({}),
    ]);
    return;
  }
}
