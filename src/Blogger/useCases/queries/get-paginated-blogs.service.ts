import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  BlogFilter,
  BlogPresentationModel,
  PaginatedOutput,
} from '../../../Model';
import { BloggerQueryRepository } from '../../repos';
import { BlogsForOwnerPaginationConfig } from '../../pipes';

export class GetPaginatedBlogs {
  public config: BlogsForOwnerPaginationConfig;
  constructor(userId: string, filters: BlogFilter) {
    this.config = new BlogsForOwnerPaginationConfig(filters, userId);
  }
}

@QueryHandler(GetPaginatedBlogs)
export class GetPaginatedBlogsUseCase
  implements IQueryHandler<GetPaginatedBlogs>
{
  constructor(private repo: BloggerQueryRepository) {}
  public async execute(
    query: GetPaginatedBlogs,
  ): Promise<PaginatedOutput<BlogPresentationModel>> {
    return await this.repo.getBlogsWithPaginationConfigForUser(query.config);
  }
}
