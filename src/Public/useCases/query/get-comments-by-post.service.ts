import { CommentsFilter, IPaginationConfig, Nullable } from '../../../Model';
import { PublicCommentsPaginationPipe } from '../../pipes';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PublicQueryRepository } from '../../repos';
import { ObjectId } from 'mongodb';
import { isMongoId } from 'class-validator';
import { NotFoundException } from '@nestjs/common';

export class GetComments {
  public config: IPaginationConfig;
  public postId: ObjectId;
  constructor(
    public userId: Nullable<string>,
    postId: string,
    filter: CommentsFilter,
  ) {
    if (!isMongoId(postId)) {
      throw new NotFoundException();
    }
    this.postId = new ObjectId(postId);
    this.config = new PublicCommentsPaginationPipe(filter, this.postId);
  }
}

@QueryHandler(GetComments)
export class GetCommentsUseCase implements IQueryHandler<GetComments> {
  constructor(private repo: PublicQueryRepository) {}
  public async execute(query: GetComments) {
    return await this.repo.getPaginatedComments(
      query.postId,
      query.userId,
      query.config,
    );
  }
}
