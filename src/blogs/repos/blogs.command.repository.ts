import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../../Model/Schema/blog.schema';
import { Model } from 'mongoose';

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
}
