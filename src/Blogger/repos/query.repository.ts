import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Repository } from '../../Base';
import {
  Ban,
  BanDocument,
  Blog,
  BlogDocument,
  BlogPresentationModel,
  IPaginationConfig,
  NullablePromise,
  PaginatedOutput,
  Post,
  PostDocument,
  User,
  UserDocument,
} from '../../Model';

@Injectable()
export class BloggerQueryRepository extends Repository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Ban.name) private banModel: Model<BanDocument>,
  ) {
    super();
  }
  public async getBlogsWithPaginationConfigForUser(
    config: IPaginationConfig,
  ): Promise<PaginatedOutput<BlogPresentationModel>> {
    const [itemsDoc, totalCount] = await this.paginate(this.blogModel, config);
    const items = itemsDoc as unknown as BlogPresentationModel[];
    return {
      pagesCount: Math.ceil(totalCount / config.limit),
      page: config.pageNumber,
      pageSize: config.limit,
      totalCount,
      items,
    };
  }

  public async isBlogExist(blogId: string): Promise<boolean> {
    return !!(await this.findById(this.blogModel, blogId));
  }

  public async getUserEntity(userId: string): NullablePromise<UserDocument> {
    return await this.findById(this.userModel, userId);
  }

  public async getBlogEntity(blogId: string): NullablePromise<BlogDocument> {
    return await this.findById(this.blogModel, blogId);
  }

  public async getPostEntity(postId: string): NullablePromise<PostDocument> {
    return await this.findById(this.postModel, postId);
  }

  public async getBanEntity(
    ownerId: string,
    userId: string,
    blogId: string,
  ): NullablePromise<BanDocument> {
    try {
      return await this.findOneWithFilter(this.banModel, {
        ownerId: new ObjectId(ownerId),
        bannedUserId: new ObjectId(userId),
        blogId: new ObjectId(blogId),
      });
    } catch (e) {
      return null;
    }
  }
}
