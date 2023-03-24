import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Blog,
  BlogDocument,
  BlogPresentationModel,
  IPaginationConfig,
  PaginatedOutput,
  User,
  UserDocument,
  UserPresentationModel,
  WithBanInfo,
} from '../../Model';
import { Model } from 'mongoose';
import { Repository } from '../../Helpers';
import { ObjectId } from 'mongodb';

@Injectable()
export class SuperAdminQueryRepository extends Repository {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    super();
  }

  public async getBlogsWithPaginationConfig(
    config: IPaginationConfig,
  ): Promise<PaginatedOutput<WithBanInfo<BlogPresentationModel>>> {
    const [itemsDoc, totalCount] = await this.paginate(this.blogModel, config);
    const { limit, pageNumber } = config;
    const items: WithBanInfo<BlogPresentationModel>[] = itemsDoc.map(
      (blog) => ({
        ...blog.toJSON(),
        blogOwnerInfo: blog._blogOwnerInfo,
      }),
    );
    const digits = { totalCount, limit, pageNumber };
    return this.paginationOutput<WithBanInfo<BlogPresentationModel>>(
      digits,
      items,
    );
  }

  public async getUserEntity(userId: ObjectId) {
    return await this.findById(this.userModel, userId);
  }

  public async getPaginatedUsers(config: IPaginationConfig) {
    const [itemsDoc, totalCount] = await this.paginate(this.userModel, config);
    const items: WithBanInfo<UserPresentationModel>[] = itemsDoc.map(
      (user: UserDocument) => ({ ...user.toJSON(), banInfo: user.banInfo }),
    );
    return {
      pagesCount: Math.ceil(totalCount / config.limit),
      page: config.pageNumber,
      pageSize: config.limit,
      totalCount,
      items,
    };
  }

  public async isUserUnique(
    field: keyof User,
    value: string,
  ): Promise<boolean> {
    const count = await this.userModel.countDocuments({ [field]: value });
    return count === 0;
  }
}
