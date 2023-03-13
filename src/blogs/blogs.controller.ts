import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsQueryRepository } from './repos';
import {
  BlogsQueryPipe,
  PostConfigFabric,
  PostsByBlogPipe,
} from './pipes/blogs.query.pipe';
import { BlogInput } from './validators/blog.validator';
import { PostInputWithoutBlogId } from './validators/post.validator';
import { BasicAuthGuard } from '../helpers';
import {
  BlogPresentationModel,
  IPaginationConfig,
  PaginatedOutput,
  PostPresentationModel,
  VoidPromise,
  WithExtendedLike,
} from '../Model';

@Controller('api/blogs')
export class BlogsController {
  constructor(
    private blogService: BlogsService,
    private queryRepo: BlogsQueryRepository,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getBlogs(
    @Query(BlogsQueryPipe) query: IPaginationConfig,
  ): Promise<PaginatedOutput<BlogPresentationModel>> {
    return await this.queryRepo.getBlogsWithPaginationConfig(query);
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  public async createBlog(
    @Body() pojo: BlogInput,
  ): Promise<BlogPresentationModel> {
    return await this.blogService.createBlog(pojo);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async getBlog(
    @Param('id') blogId: string,
  ): Promise<BlogPresentationModel> {
    return await this.queryRepo.getBlogById(blogId);
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async updateBlog(
    @Param('id') blogId: string,
    @Body() pojo: BlogInput,
  ): VoidPromise {
    await this.blogService.updateById(blogId, pojo);
    return;
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteBlog(@Param('id') blogId: string): VoidPromise {
    return await this.blogService.deleteById(blogId);
  }

  @Get(':id/posts')
  @HttpCode(HttpStatus.OK)
  public async getPostsByBlogID(
    @Query(PostsByBlogPipe) configFabric: PostConfigFabric,
    @Param('id') id: string,
  ): Promise<PaginatedOutput<WithExtendedLike<PostPresentationModel>>> {
    return await this.queryRepo.getPostsByBlogId(configFabric(id));
  }

  @Post(':id/posts')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  public async createPost(
    @Param('id') blogId: string,
    @Body() pojo: PostInputWithoutBlogId,
  ) {
    return await this.blogService.createPostWithSpecifiedBlog(blogId, pojo);
  }
}
