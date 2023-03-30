import { IPaginationConfig, Nullable, PostFilter } from '../../../Model';
import { PublicPostsPaginationPipe } from '../../pipes';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PublicQueryRepository } from '../../repos';

export class GetPosts {
  public config: IPaginationConfig;
  constructor(public userId: Nullable<string>, filter: PostFilter) {
    this.config = new PublicPostsPaginationPipe(filter);
  }
}

@QueryHandler(GetPosts)
export class GetPostsUseCase implements IQueryHandler<GetPosts> {
  constructor(private repo: PublicQueryRepository) {}
  public async execute({ userId, config }: GetPosts) {
    return await this.repo.getPaginatedPosts(userId, config);
  }
}
