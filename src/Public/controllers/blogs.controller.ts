import { QueryBus } from '@nestjs/cqrs';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { query } from '../useCases';
import { Meta, SoftJwtGuard } from '../../Base';
import {
  BlogFilter,
  BlogPresentationModel,
  PaginatedOutput,
  PostFilter,
  PostPresentationModel,
  SoftGuardMeta,
  WithExtendedLike,
} from '../../Model';

@Controller('api/blogs')
export class BlogsController {
  constructor(private bus: QueryBus) {}
  @Get()
  public async getBlogs(
    @Query() filters: BlogFilter,
  ): Promise<PaginatedOutput<BlogPresentationModel>> {
    return await this.bus.execute(new query.GetBlogs(filters));
  }
  @Get(':id')
  public async getBlogById(
    @Param('id') blogId: string,
  ): Promise<BlogPresentationModel> {
    return await this.bus.execute(new query.GetBlog(blogId));
  }
  @Get(':id/posts')
  @UseGuards(SoftJwtGuard)
  public async getPostsByBlogId(
    @Param('id') blogId: string,
    @Query() filters: PostFilter,
    @Meta() meta: SoftGuardMeta,
  ): Promise<PaginatedOutput<WithExtendedLike<PostPresentationModel>>> {
    return await this.bus.execute(
      new query.GetPostsByBlog(meta.userId, blogId, filters),
    );
  }
}
