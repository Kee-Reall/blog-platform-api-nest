import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AdminQueryRepository } from '../../repos';
import { BlogsPaginationPipe, DefaultBlogsFilters } from '../../pipes';
import {
  BlogFilter,
  BlogPresentationModel,
  PaginatedOutput,
} from '../../../Model';

export class GetPaginatedBlogs {
  config: BlogsPaginationPipe;
  constructor(input?: BlogFilter) {
    if (!input) {
      this.config = new BlogsPaginationPipe(new DefaultBlogsFilters());
    } else {
      this.config = new BlogsPaginationPipe(input);
    }
  }
}

@QueryHandler(GetPaginatedBlogs)
export class AdminGetBlogsHandler implements IQueryHandler<GetPaginatedBlogs> {
  constructor(private queryRepo: AdminQueryRepository) {}
  public async execute({
    config,
  }: GetPaginatedBlogs): Promise<PaginatedOutput<BlogPresentationModel>> {
    return await this.queryRepo.getBlogsWithPaginationConfig(config);
  }
}
