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
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import {
  BlogInputModel,
  BlogPresentationModel,
} from '../Model/Type/blogs.types';
import { VoidPromise } from '../Model/Type/promise.types';
import { BlogFilters } from '../Model/Type/query.types';
import { BlogsQueryRepository } from './repos/blogs.query.repository';
import { PaginatedOutput } from '../Model/Type/pagination.types';

@Controller('api/blogs')
export class BlogsController {
  constructor(
    private blogService: BlogsService,
    private queryRepo: BlogsQueryRepository,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getBlogs(
    @Query() query: BlogFilters,
  ): Promise<PaginatedOutput<BlogPresentationModel>> {
    return await this.queryRepo.getBlogsWithPaginationConfig(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getBlog(@Param('id') blogId: string): Promise<BlogPresentationModel> {
    return await this.queryRepo.getBlogById(blogId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBlog(
    @Body() crateBlogPOJO: BlogInputModel,
  ): Promise<BlogPresentationModel> {
    return await this.blogService.createBlog(crateBlogPOJO);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param('id') blogId: string,
    @Body() updateBlogPOJO: BlogInputModel,
  ): Promise<BlogPresentationModel> {
    return await this.blogService.updateById(blogId, updateBlogPOJO);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') blogId: string): VoidPromise {
    return await this.blogService.deleteById(blogId);
  }
}
