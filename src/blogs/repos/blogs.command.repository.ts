import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../../Model/Schema/blog.schema';
import { Model } from 'mongoose';
import { BlogInputModel } from '../../Model/Type/blogs.types';
import { Repository } from '../../helpers/classes/repository.class';
import { PostDocument } from '../../Model/Schema/post.schema';

@Injectable()
export class BlogsCommandRepository extends Repository {
  constructor(@InjectModel(Blog.name) private BlogModel: Model<BlogDocument>) {
    super();
  }

  public async updateBlog(id: string, pojo: BlogInputModel): Promise<boolean> {
    const blog = await this.findById(this.BlogModel, id);
    if (!blog) {
      throw new NotFoundException();
    }
    for (const key in pojo) {
      blog[key] = pojo[key];
    }
    const isSaved: boolean = await this.save(blog);
    if (!isSaved) {
      throw new BadRequestException();
    }
    return !!blog;
  }

  public saveBlog(blog: BlogDocument): Promise<boolean> {
    return this.save(blog);
  }

  public savePost(post: PostDocument): Promise<boolean> {
    return this.save(post);
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
