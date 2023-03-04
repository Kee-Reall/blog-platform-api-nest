import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../../Model/Schema/blog.schema';
import { Repository } from '../../helpers/classes/repository.class';
import { PostDocument } from '../../Model/Schema/post.schema';

@Injectable()
export class BlogsCommandRepository extends Repository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {
    super();
  }

  public async saveBlog(blog: BlogDocument): Promise<boolean> {
    return await this.saveEntity(blog);
  }

  public async savePost(post: PostDocument): Promise<boolean> {
    return await this.saveEntity(post);
  }

  public async deleteBlog(id: string): Promise<boolean> {
    return await this.deleteUsingId(this.blogModel, id);
  }
}
