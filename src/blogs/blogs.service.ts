import {
  ImATeapotException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../Model/Schema/blog.schema';
import {
  BlogInputModel,
  BlogPresentationModel,
} from '../Model/Type/blogs.types';
import { BlogsCommandRepository } from './repos/blogs.command.repository';
import { BlogsQueryRepository } from './repos/blogs.query.repository';
import { VoidPromise } from '../Model/Type/promise.types';
import {
  PostInputModel,
  PostPresentationModel,
} from '../Model/Type/posts.types';
import { Post, PostDocument } from '../Model/Schema/post.schema';
import { WithExtendedLike } from '../Model/Type/likes.types';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private commandRepo: BlogsCommandRepository,
    private queryRepo: BlogsQueryRepository,
  ) {}

  public async createBlog(
    pojo: BlogInputModel,
  ): Promise<BlogPresentationModel> {
    const blog = new this.blogModel(pojo);
    const result = await this.commandRepo.saveBlog(blog);
    if (!result) {
      throw new ImATeapotException();
    }
    return blog;
  }

  public async updateById(id: string, pojo: BlogInputModel): VoidPromise {
    const blog = await this.queryRepo.getBlogEntityById(id);
    if (!blog) {
      throw new NotFoundException();
    }
    for (const key in pojo) {
      blog[key] = pojo[key];
    }
    const isSaved: boolean = await this.commandRepo.saveBlog(blog);
    if (!isSaved) {
      throw new ImATeapotException();
    }
    await this.commandRepo.updatePostsName(blog.id, blog.name);
    return;
  }

  public async deleteById(blogId: string): VoidPromise {
    if (!(await this.commandRepo.deleteBlog(blogId))) {
      throw new NotFoundException();
    }
    return;
  }

  public async createPostWithSpecifiedBlog(
    blogId: string,
    pojo: Omit<PostInputModel, 'blogId'>,
  ): Promise<WithExtendedLike<PostPresentationModel>> {
    const blog = await this.queryRepo.getBlogById(blogId);
    if (!blog) {
      throw new NotFoundException();
    }
    const post = new this.postModel({ ...pojo, blogId, blogName: blog.name });
    const result = await this.commandRepo.savePost(post);
    if (!result) {
      throw new ImATeapotException();
    }
    return {
      ...(post.toJSON() as PostPresentationModel),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
  }
}
