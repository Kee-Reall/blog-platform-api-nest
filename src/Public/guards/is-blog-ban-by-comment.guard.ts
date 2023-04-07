import { ObjectId } from 'mongodb';
import { isValidObjectId } from 'mongoose';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PublicQueryRepository } from '../repos';
import { PopulatedPostDocument } from '../../Model';

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
    const post = (await comment.populate('postId')) as PopulatedPostDocument;
    return post.postId._isBlogBanned;
  }
}
