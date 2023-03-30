import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlogFilter } from '../../../Model';
import { PaginationConfig } from '../../../Base';
import { PublicQueryRepository } from '../../repos';
import { PublicBlogsPipe } from '../../pipes';

export class GetBlogs {
  config: PaginationConfig;
  constructor(filer: BlogFilter) {
    this.config = new PublicBlogsPipe(filer);
  }
}

@QueryHandler(GetBlogs)
export class GetPaginatedBlogsUseCase implements IQueryHandler<GetBlogs> {
  constructor(private repo: PublicQueryRepository) {}
  public async execute(query: GetBlogs) {
    return await this.repo.getPaginatedBlogs(query.config);
  }
}
