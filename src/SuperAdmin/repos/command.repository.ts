import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Repository } from '../../Base';
import {
  Blog,
  BlogDocument,
  Comment,
  CommentDocument,
  Like,
  LikeDocument,
  Post,
  PostDocument,
  Session,
  SessionDocument,
  User,
  UserDocument,
} from '../../Model';

@Injectable()
export class AdminCommandRepository extends Repository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {
    super();
  }

  public async deleteUser(id: string | ObjectId): Promise<boolean> {
    return await this.deleteUsingId(this.userModel, id);
  }

  public async saveUser(user: UserDocument) {
    return await this.saveEntity(user);
  }

  public async saveBlog(blog: BlogDocument) {
    return await this.saveEntity(blog);
  }

  public async banUserEntities(
    userId: ObjectId,
    banStatus: boolean,
  ): Promise<boolean> {
    let isProcessSuccess = true;
    const updateQuery = { $set: { _isOwnerBanned: banStatus } };
    try {
      const blogBan = this.blogModel.updateMany(
        { '_blogOwnerInfo.userId': userId },
        updateQuery,
      );
      const postBan = this.postModel.updateMany(
        { _ownerId: userId },
        updateQuery,
      );
      const commentBan = this.commentModel.updateMany(
        { 'commentatorInfo.userId': userId },
        updateQuery,
      );
      const likeBan = this.likeModel.updateMany({ userId }, updateQuery);
      const killSession = this.sessionModel.deleteMany({ userId });
      await Promise.all([blogBan, postBan, commentBan, likeBan, killSession]);
    } catch (e) {
      isProcessSuccess = false;
    } finally {
      return isProcessSuccess;
    }
  }

  public async banBlogEntities(
    blog: BlogDocument,
    status: boolean,
  ): Promise<boolean> {
    try {
      blog._isBlogBanned = status;
      blog._banDate = status ? new Date() : null;
      await Promise.all([
        this.saveBlog(blog),
        this.postModel.updateMany(
          { blogId: blog._id },
          { $set: { _isBlogBanned: status } },
        ),
      ]);
      return true;
    } catch (e) {
      return false;
    }
  }
}
