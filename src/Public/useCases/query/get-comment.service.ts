import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentPresentationModel, Nullable, WithLike } from '../../../Model';
import { PublicQueryRepository } from '../../repos';

export class GetComment {
  constructor(public userId: Nullable<string>, public commentId: string) {}
}

@QueryHandler(GetComment)
export class GetCommentUseCase implements IQueryHandler<GetComment> {
  constructor(private repo: PublicQueryRepository) {}
  public async execute(
    query: GetComment,
  ): Promise<WithLike<CommentPresentationModel>> {
    return await this.repo.getCommentWithLike(query.commentId, query.userId);
  }
}
