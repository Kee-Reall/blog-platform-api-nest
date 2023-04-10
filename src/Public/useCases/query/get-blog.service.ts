import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PublicQueryRepository } from '../../repos';
import { BlogPresentationModel } from '../../../Model';

export class GetBlog {
  constructor(public id: string) {}
}

@QueryHandler(GetBlog)
export class GetBlogUseCase implements IQueryHandler<GetBlog> {
  constructor(private repo: PublicQueryRepository) {}
  public async execute(query: GetBlog): Promise<BlogPresentationModel> {
    const blog = await this.repo.getBlogEntity(query.id);
    if (!blog || blog._isOwnerBanned || blog._isBlogBanned) {
      throw new NotFoundException();
    }
    return blog.toJSON() as BlogPresentationModel;
  }
}
