import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { PublicQueryRepository } from '../../repos';
import {
  Nullable,
  PostPresentationModel,
  WithExtendedLike,
} from '../../../Model';

export class GetPost {
  constructor(public postId: string, public userId: Nullable<string>) {
    if (!userId) {
      this.userId = null;
    }
  }
}

@QueryHandler(GetPost)
export class GetPostUseCase implements IQueryHandler<GetPost> {
  constructor(private repo: PublicQueryRepository) {}
  public async execute(
    query: GetPost,
  ): Promise<WithExtendedLike<PostPresentationModel>> {
    const post = await this.repo.getPostEntity(query.postId);
    if (!post || post._isOwnerBanned || post._isBlogBanned) {
      throw new NotFoundException();
    }
    return await this.repo.getExtendedLikeInfo(post, query.userId);
  }
}
