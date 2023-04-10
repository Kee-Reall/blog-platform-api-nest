import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Repository } from '../../Base';
import {
  Blog,
  BlogDocument,
  BlogPresentationModel,
  BlogStaticMethods,
  IPaginationConfig,
  ModelWithStatic,
  NullablePromise,
  PaginatedOutput,
  User,
  UserDocument,
  UserModelStatics,
  UserPresentationModel,
  WithBanInfo,
} from '../../Model';

@Injectable()
export class AdminQueryRepository extends Repository {
  constructor(
    @InjectModel(Blog.name)
    private blogModel: ModelWithStatic<BlogDocument, BlogStaticMethods>,
    @InjectModel(User.name)
    private userModel: ModelWithStatic<UserDocument, UserModelStatics>,
  ) {
    super();
  }

  public async getBlogsWithPaginationConfig(
    config: IPaginationConfig,
  ): Promise<PaginatedOutput<WithBanInfo<BlogPresentationModel>>> {
    const [itemsDoc, totalCount] = await this.paginate(this.blogModel, config);
    const { limit, pageNumber } = config;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const items: WithBanInfo<BlogPresentationModel>[] = itemsDoc.map(
      (blog) => ({
        ...blog.toJSON(),
        blogOwnerInfo: blog._blogOwnerInfo,
        banInfo: {
          isBanned: blog._isBlogBanned,
          banDate: blog._banDate,
        },
      }),
    );
    const digits = { totalCount, limit, pageNumber };
    return this.paginationOutput<WithBanInfo<BlogPresentationModel>>(
      digits,
      items,
    );
  }

  public async getUserEntity(userId: ObjectId | string) {
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

  public async getBlogEntity(
    blogId: ObjectId | string,
  ): NullablePromise<BlogDocument> {
    return await this.findById(this.blogModel, blogId);
  }
}
