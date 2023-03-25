import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Repository } from '../../Base';
import {
  Blog,
  BlogDocument,
  BlogPresentationModel,
  IPaginationConfig,
  NullablePromise,
  PaginatedOutput,
  User,
  UserDocument,
} from '../../Model';

@Injectable()
export class BloggerQueryRepository extends Repository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
  ) {
    super();
  }
  public async getUserEntity(userId: string): NullablePromise<UserDocument> {
    return this.findById(this.userModel, userId);
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
}
