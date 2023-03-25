import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Repository } from '../../Base';
import {
  Comment,
  CommentDocument,
  LikeDocument,
  Post,
  PostDocument,
} from '../../Model';

@Injectable()
export class PostsCommandRepository extends Repository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {
    super();
  }

  public async savePost(post: PostDocument): Promise<boolean> {
    return await this.saveEntity(post);
  }

  public async deletePost(id: string) {
    return await this.deleteUsingId(this.postModel, id);
  }

  public async saveLike(like: LikeDocument): Promise<boolean> {
    return await this.saveEntity(like);
  }

  public async saveComment(comment: CommentDocument) {
    return await this.saveEntity(comment);
  }

  public async deleteComment(comment: CommentDocument) {
    return await this.deleteUsingId(this.commentModel, comment._id);
  }
}
