import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Repository } from '../../helpers';
import { PostsPaginationConfig } from '../../posts/pipes/posts.pagination.class';
import {
  Blog,
  BlogDocument,
  BlogPresentationModel,
  IPaginationConfig,
  Like,
  LikeDocument,
  LikesInfo,
  Nullable,
  PaginatedOutput,
  Post,
  PostDocument,
  PostPresentationModel,
  WithExtendedLike,
} from '../../Model';

@Injectable()
export class BlogsQueryRepository extends Repository {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
  ) {
    super();
  }

  public async getBlogsWithPaginationConfig(
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

  public async getBlogById(id: string): Promise<BlogPresentationModel> {
    const blog = await this.findById(this.blogModel, id);
    if (!blog) {
      throw new NotFoundException();
    }
    return blog.toJSON() as BlogPresentationModel;
  }

  public async getBlogEntityById(id: string): Promise<BlogDocument> {
    const blog = await this.findById(this.blogModel, id);
    if (!blog) {
      throw new NotFoundException();
    }
    return blog;
  }

  public async getPostsByBlogId(
    config: PostsPaginationConfig,
    userId: Nullable<string>,
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
