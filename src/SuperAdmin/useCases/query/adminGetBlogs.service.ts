import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SuperAdminQueryRepository } from '../../repos';
import { BlogsPagination, DefaultBlogQuery } from '../../../Infrastructure';
import {
  BlogFilter,
  BlogPresentationModel,
  PaginatedOutput,
} from '../../../Model';

export class GetPaginatedBlogs {
  config: BlogsPagination;
  constructor(input?: BlogFilter) {
    if (!input) {
      this.config = new BlogsPagination(new DefaultBlogQuery());
    } else {
      this.config = new BlogsPagination(input);
    }
  }
}

@QueryHandler(GetPaginatedBlogs)
export class AdminGetBlogsHandler implements IQueryHandler<GetPaginatedBlogs> {
  constructor(private queryRepo: SuperAdminQueryRepository) {}
  async execute({
    config,
  }: GetPaginatedBlogs): Promise<PaginatedOutput<BlogPresentationModel>> {
    return await this.queryRepo.getBlogsWithPaginationConfig(config);
  }
}
