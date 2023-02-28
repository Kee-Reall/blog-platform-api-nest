import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../../Model/Schema/blog.schema';
import { Model } from 'mongoose';
import { BlogInputModel } from '../../Model/Type/blogs.types';

@Injectable()
export class BlogsCommandRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: Model<BlogDocument>) {}
  public async saveBlog(blog: BlogDocument): Promise<boolean> {
    try {
      await blog.save();
      return true;
    } catch (e) {
      return false;
    }
  }

  public async updateBlog(_id: string, pojo: BlogInputModel): Promise<boolean> {
    try {
      const blog = await this.BlogModel.findOneAndUpdate({ _id }, pojo, {
        returnDocument: 'after',
      });
      return !!blog;
    } catch (e) {
      return false;
    }
  }

  public async deleteBlog(_id: string): Promise<boolean> {
    try {
      const { deletedCount } = await this.BlogModel.deleteOne({ _id });
      return deletedCount > 0;
    } catch (e) {
      return false;
    }
  }
}
