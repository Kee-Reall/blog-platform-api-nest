import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import {
  BlogInputModel,
  BlogPresentationModel,
} from '../Model/Type/blogs.types';

@Controller()
export class BlogsController {
  constructor(private blogService: BlogsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getBlogs(): Promise<BlogPresentationModel[]> {
    return await this.blogService.getBlogs();
  }

  @Get(':id')
  async getBlog(@Param('id') blogId: string) {
    return await this.blogService.findById(blogId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBlog(
    @Body() crateBlogPOJO: BlogInputModel,
  ): Promise<BlogPresentationModel> {
    return await this.blogService.createBlog(crateBlogPOJO);
  }
}
