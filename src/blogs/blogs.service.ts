import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  public async updateById(
    _id: string,
    pojo: BlogInputModel,
  ): Promise<BlogPresentationModel> {
    const blog = await this.BlogModel.findOneAndUpdate({ _id }, pojo, {
      returnDocument: 'after',
    });
    if (!blog) {
      throw new NotFoundException();
    }
    return blog;
  }

  async deleteById(blogId: string) {
    const result = await this.BlogModel.deleteOne({ _id: blogId });
    if (result.deletedCount < 0) {
      throw new NotFoundException();
    }
    return;
  }
}
