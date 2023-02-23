import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../Model/Schema/blog.schema';
import {
  BlogInputModel,
  BlogPresentationModel,
} from '../Model/Type/blogs.types';
import { Model } from 'mongoose';

@Injectable()
export class BlogsService {
  constructor(@InjectModel(Blog.name) private BlogModel: Model<any>) {}
  public async getBlogs() {
    const blogs = await this.BlogModel.find({}).exec();
    if (blogs.length < 1) {
      throw new NotFoundException('fuck you leather man');
    }
    return blogs;
  }

  public async findById(id: string) {
    const blog = await this.BlogModel.findById(id);
    if (!blog) {
      throw new NotFoundException("blog doesn't exist");
    }
    return blog;
  }

  public async createBlog(
    pojo: BlogInputModel,
  ): Promise<BlogPresentationModel> {
    try {
      const blog = new this.BlogModel(pojo);
      await blog.save();
      return blog;
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  public async updateById(
    _id: string,
    pojo: BlogInputModel,
  ): Promise<BlogPresentationModel> {
    return await this.BlogModel.findOneAndUpdate({ _id }, pojo);
  }

  public async deleteById(_id: string) {
    const result = await this.BlogModel.deleteOne({ _id });
    if (result.deletedCount > 0) {
      return;
    }
    throw new NotFoundException('blog does not exist');
  }
}
