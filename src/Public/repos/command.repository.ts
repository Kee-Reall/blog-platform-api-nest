import { Repository } from '../../Base';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument, LikeDocument } from '../../Model';
import { Model } from 'mongoose';

@Injectable()
export class PublicCommandRepository extends Repository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {
    super();
  }
  public async saveLike(like: LikeDocument): Promise<boolean> {
    return await this.saveEntity(like);
  }

  public async saveComment(comment: CommentDocument): Promise<boolean> {
    return await this.saveEntity(comment);
  }

  public async deleteComment(comment: CommentDocument) {
    return await this.deleteUsingId(this.commentModel, comment._id);
  }
}
