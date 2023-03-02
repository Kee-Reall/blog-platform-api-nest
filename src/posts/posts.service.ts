import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  PostInputModel,
  PostPresentationModel,
} from '../Model/Type/posts.types';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Blog,
  BlogDocument,
  BlogSchemaMethods,
} from '../Model/Schema/blog.schema';
import {
  Post,
  PostDocument,
  PostSchemaMethods,
} from '../Model/Schema/post.schema';
import { PostsCommandRepository } from './repos/posts.command.repository';
import { WithExtendedLike } from '../Model/Type/likes.types';
import { Nullable, VoidPromise } from '../Model/Type/promise.types';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Blog.name)
    private blogModel: Model<BlogDocument> & BlogSchemaMethods,
    @InjectModel(Post.name)
    private postModel: Model<PostDocument> & PostSchemaMethods,
    private commandRepo: PostsCommandRepository,
  ) {}
  public async createPost(
    pojo: PostInputModel,
  ): Promise<WithExtendedLike<PostPresentationModel>> {
    const blog: Nullable<BlogDocument> = await this.blogModel.NullableFindById(
      pojo.blogId,
    );
    if (!blog) {
      throw new BadRequestException();
    }
    const post = new this.postModel({ ...pojo, blogName: blog.name });
    const isSaved: boolean = await this.commandRepo.saveNewPost(post);
    if (!isSaved) {
      throw new BadRequestException();
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

  public async updatePost(id: string, pojo: PostInputModel) {
    const post = await this.postModel.NullableFindById(id);
    if (!post) {
      throw new NotFoundException();
    }
    const blog: Nullable<BlogDocument> = await this.blogModel.NullableFindById(
      pojo.blogId,
    );
    if (!blog) {
      throw new BadRequestException();
    }
    for (const key in pojo) {
      post[key] = pojo[key];
    }
    post.blogName = blog.name;
    const isSaved = await this.commandRepo.savePost(post);
    if (!isSaved) {
      console.log('you are here');
      throw new BadRequestException();
    }
    return;
  }

  public async deletePost(id: string): VoidPromise {
    const isDeleted: boolean = await this.commandRepo.deletePost(id);
    if (!isDeleted) {
      throw new NotFoundException();
    }
    return;
  }
}
