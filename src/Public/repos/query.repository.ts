import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationConfig, Repository } from '../../Base';
import {
  Blog,
  BlogDocument,
  BlogPresentationModel,
  BlogStaticMethods,
  IPaginationConfig,
  Like,
  LikeDocument,
  LikesInfo,
  ModelWithStatic,
  Nullable,
  NullablePromise,
  PaginatedOutput,
  Post,
  PostDocument,
  PostPresentationModel,
  PostStaticMethods,
  WithExtendedLike,
} from '../../Model';

@Injectable()
export class PublicQueryRepository extends Repository {
  constructor(
    @InjectModel(Blog.name)
    private blogModel: ModelWithStatic<BlogDocument, BlogStaticMethods>,
    @InjectModel(Post.name)
    private postModel: ModelWithStatic<PostDocument, PostStaticMethods>,
    @InjectModel(Like.name)
    private likeModel: Model<LikeDocument>,
  ) {
    super();
  }

  public getBlogEntity(id: string | ObjectId): NullablePromise<BlogDocument> {
    return this.findById(this.blogModel, id);
  }

  public async getPaginatedBlogs(
    config: PaginationConfig,
  ): Promise<PaginatedOutput<BlogPresentationModel>> {
    const [itemsDoc, totalCount] = await this.paginate(this.blogModel, config);
    const items = itemsDoc.map(
      (blog) => blog.toJSON() as BlogPresentationModel,
    );
    const { limit, pageNumber } = config;
    return this.paginationOutput({ totalCount, limit, pageNumber }, items);
  }

  public async getPaginatedPostsWithSpecifiedBlogs(
    userId: Nullable<string>,
    config: IPaginationConfig,
  ): Promise<PaginatedOutput<WithExtendedLike<PostPresentationModel>>> {
    const blog = await this.findById(this.blogModel, config.filter.blogId);
    if (!blog) {
      throw new NotFoundException();
    }
    const [itemsWithoutLike, totalCount] = await this.paginate(
      this.postModel,
      config,
    );
    const likesInfo: LikesInfo[] = await this.countLikesInfo(
      this.likeModel,
      itemsWithoutLike,
      userId,
    );
    const items = await Promise.all(
      itemsWithoutLike.map(async (item, idx) => {
        return {
          ...(item.toJSON() as PostPresentationModel),
          extendedLikesInfo: {
            ...likesInfo[idx],
            newestLikes: await this.getLastLikes(this.likeModel, item._id),
          },
        };
      }),
    );
    return {
      pagesCount: Math.ceil(totalCount / config.limit),
      page: config.pageNumber,
      pageSize: config.limit,
      totalCount,
      items,
    };
  }
}
