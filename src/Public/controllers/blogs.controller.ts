import { QueryBus } from '@nestjs/cqrs';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { query } from '../useCases';
import { SoftJwtAuthGuard, Meta } from '../../Infrastructure';
import { BlogFilter, PostFilter, SoftGuardMeta } from '../../Model';

@Controller('api/blogs')
export class BlogsController {
  constructor(private bus: QueryBus) {}
  @Get()
  public async getBlogs(@Query() filters: BlogFilter) {
    return await this.bus.execute(new query.GetBlogs(filters));
  }
  @Get(':id')
  public async getBlogById(@Param('id') blogId: string) {
    console.log('test');
    return await this.bus.execute(new query.GetBlog(blogId));
  }
  @Get(':id/posts')
  @UseGuards(SoftJwtAuthGuard)
  public async getPostsByBlogId(
    @Param('id') blogId: string,
    @Query() filters: PostFilter,
    @Meta() meta: SoftGuardMeta,
  ) {
    return await this.bus.execute(
      new query.GetPostsByBlog(meta.userId, blogId, filters),
    );
  }
}
