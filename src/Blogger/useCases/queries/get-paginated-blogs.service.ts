import { BlogFilter } from '../../../Model';
import { BlogsForOwnerPaginationConfig } from '../../pipes/blogs-for-owner.pagination.class';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BloggerQueryRepository } from '../../repos';

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
  public async execute(query: GetPaginatedBlogs): Promise<any> {
    return await this.repo.getBlogsWithPaginationConfigForUser(query.config);
  }
}
