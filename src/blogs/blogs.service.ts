import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../Model/Schema/blog.schema';
import {
  BlogInputModel,
  BlogPresentationModel,
} from '../Model/Type/blogs.types';
import { Model } from 'mongoose';
import { BlogsCommandRepository } from './repos/blogs.command.repository';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private BlogModel: Model<BlogDocument>,
    private commandRepo: BlogsCommandRepository,
  ) {}

  public async createBlog(
    pojo: BlogInputModel,
  ): Promise<BlogPresentationModel> {
    const blog = new this.BlogModel(pojo);
    const result = await this.commandRepo.saveBlog(blog);
    if (!result) {
      throw new BadRequestException();
    }
    return blog;
  }

  // public async updateById(
  //   _id: string,
  //   pojo: BlogInputModel,
  // ): Promise<BlogPresentationModel> {
  //
  // }

  // public async deleteById(_id: string) {
  //
  // }
}
