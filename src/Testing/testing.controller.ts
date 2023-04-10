import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
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
  SessionDocument,
  Session,
  Ban,
  BanDocument,
} from '../Model';

@Controller('api/testing')
export class TestingController {
  constructor(
    @InjectModel(Ban.name) private banModel: Model<BanDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

  @Get('always-ok') //
  @HttpCode(HttpStatus.OK)
  public async alwaysOk(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { url, baseUrl, body, originalUrl, params, path, protocol, query } =
      req;
    const { status, statusCode, statusMessage } = res;
    return {
      url,
      baseUrl,
      body,
      originalUrl,
      params,
      path,
      protocol,
      query,
      status,
      statusCode,
      statusMessage,
    };
  }
  @Delete('all-data')
  @HttpCode(204)
  public async clear() {
    await Promise.all([
      this.postModel.deleteMany({}),
      this.blogModel.deleteMany({}),
      this.likeModel.deleteMany({}),
      this.commentModel.deleteMany({}),
      this.userModel.deleteMany({}),
      this.sessionModel.deleteMany({}),
      this.banModel.deleteMany({}),
    ]);
    return;
  }
}
