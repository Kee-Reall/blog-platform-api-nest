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
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import {
  BlogInputModel,
  BlogPresentationModel,
} from '../Model/Type/blogs.types';
import { VoidPromise } from '../Model/Type/promise.types';

@Controller()
export class BlogsController {
  constructor(private blogService: BlogsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getBlogs(): Promise<BlogPresentationModel[]> {
    return await this.blogService.getBlogs();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBlog(
    @Body() crateBlogPOJO: BlogInputModel,
  ): Promise<BlogPresentationModel> {
    return await this.blogService.createBlog(crateBlogPOJO);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getBlog(@Param('id') blogId: string): Promise<BlogPresentationModel> {
    return await this.blogService.findById(blogId);
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
