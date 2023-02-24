import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../../Model/Schema/blog.schema';
import { Model } from 'mongoose';
import { BlogPresentationModel } from '../../Model/Type/blogs.types';

@Injectable()
export class BlogsCommandRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: Model<BlogDocument>) {}
  public saveBlog(blog: BlogPresentationModel): Promise<boolean> {
    try {
      await blog.save();
      return true;
    } catch (e) {
      return false;
    }
  }
}
