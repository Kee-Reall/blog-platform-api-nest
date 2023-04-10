import { ObjectId } from 'mongodb';
import { isValidObjectId } from 'mongoose';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PublicQueryRepository } from '../repos';
import { CommentDocument, Populated, PostDocument } from '../../Model';

@Injectable()
export class IsBlogBanByCommentGuard implements CanActivate {
  constructor(private repo: PublicQueryRepository) {}
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const commentId = req.params;
    if (!isValidObjectId(commentId)) {
      throw new NotFoundException();
    }
    const comment = await this.repo.getCommentEntity(new ObjectId(commentId));
    if (!comment) {
      throw new NotFoundException();
    }
    const populatedComment = (await comment.populate('postId')) as Populated<
      CommentDocument,
      PostDocument,
      'postId'
    >;
    return populatedComment.postId._isBlogBanned;
  }
}
