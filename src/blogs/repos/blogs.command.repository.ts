import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../../Model/Schema/blog.schema';
import { Repository } from '../../helpers/classes/repository.class';
import { Post, PostDocument } from '../../Model/Schema/post.schema';
import { VoidPromise } from '../../Model/Type/promise.types';

@Injectable()
export class BlogsCommandRepository extends Repository {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {
    super();
  }

  public async saveBlog(blog: BlogDocument): Promise<boolean> {
    return await this.saveEntity(blog);
  }

  public async savePost(post: PostDocument): Promise<boolean> {
    return await this.saveEntity(post);
  }

  public async updatePostsName(blogId: string, blogName: string): VoidPromise {
    await this.postModel.updateMany({ blogId }, { $set: { blogName } });
    return;
  }

  public async deleteBlog(id: string): Promise<boolean> {
    return await this.deleteUsingId(this.blogModel, id);
  }
}
