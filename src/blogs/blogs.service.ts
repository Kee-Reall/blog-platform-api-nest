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
import { BlogsQueryRepository } from './repos/blogs.query.repository';
import { VoidPromise } from '../Model/Type/promise.types';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private BlogModel: Model<BlogDocument>,
    private commandRepo: BlogsCommandRepository,
    private queryRepo: BlogsQueryRepository,
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

  public async updateById(id: string, pojo: BlogInputModel): VoidPromise {
    if (!(await this.commandRepo.updateBlog(id, pojo))) {
      throw new NotFoundException();
    }
    return;
  }

  public async deleteById(blogId: string): VoidPromise {
    if (!(await this.commandRepo.deleteBlog(blogId))) {
      throw new NotFoundException();
    }
    return;
  }
}
