import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
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
    @InjectConnection() private connection: Connection,
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

  public async banEntities(
    userId: ObjectId,
    banStatus: boolean,
  ): Promise<boolean> {
    let isTransactionSuccess = true;
    const updateQuery = { $set: { _isOwnerBanned: banStatus } };
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const blogBan = this.blogModel
        .updateMany({ '_blogOwnerInfo.userId': userId }, updateQuery)
        .session(session);
      const postBan = this.postModel
        .updateMany({ _ownerId: userId }, updateQuery)
        .session(session);
      const commentBan = this.commentModel
        .updateMany({ userId }, updateQuery)
        .session(session);
      const likeBan = this.likeModel
        .updateMany({ userId }, updateQuery)
        .session(session);
      const killSession = this.sessionModel.deleteMany({ userId }, session);
      await Promise.all([blogBan, postBan, commentBan, likeBan, killSession]);
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      isTransactionSuccess = false;
    } finally {
      await session.endSession();
      return isTransactionSuccess;
    }
  }
}
