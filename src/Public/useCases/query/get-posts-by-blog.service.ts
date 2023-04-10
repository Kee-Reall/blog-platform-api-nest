import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PublicPostsByBlogPaginationPipe } from '../../pipes';
import { PublicQueryRepository } from '../../repos';
import {
  IPaginationConfig,
  Nullable,
  PaginatedOutput,
  PostFilter,
  PostPresentationModel,
  WithExtendedLike,
} from '../../../Model';
import { NotFoundException } from '@nestjs/common';

export class GetPostsByBlog {
  config: IPaginationConfig;
  constructor(
    public userId: Nullable<string>,
    public blogId: string,
    filter: PostFilter,
  ) {
    this.config = new PublicPostsByBlogPaginationPipe(filter, blogId);
  }
}

@QueryHandler(GetPostsByBlog)
export class GetPostsByBlogsUseCase implements IQueryHandler<GetPostsByBlog> {
  constructor(private repo: PublicQueryRepository) {}
  public async execute(
    query: GetPostsByBlog,
  ): Promise<PaginatedOutput<WithExtendedLike<PostPresentationModel>>> {
    const blog = await this.repo.getBlogEntity(query.blogId);
    if (!blog || blog._isOwnerBanned || blog._isBlogBanned) {
      throw new NotFoundException();
    }
    return await this.repo.getPaginatedPostsWithSpecifiedBlogs(
      query.userId,
      query.config,
    );
  }
}
