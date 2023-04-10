import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationConfig, Repository } from '../../Base';
import {
  Ban,
  BanDocument,
  Blog,
  BlogDocument,
  BlogPresentationModel,
  BlogStaticMethods,
  Comment,
  CommentDocument,
  CommentPresentationModel,
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
  User,
  UserDocument,
  UserModelStatics,
  WithExtendedLike,
  WithLike,
} from '../../Model';

@Injectable()
export class PublicQueryRepository extends Repository {
  constructor(
    @InjectModel(Blog.name)
    private blogModel: ModelWithStatic<BlogDocument, BlogStaticMethods>,
    @InjectModel(Post.name)
    private postModel: ModelWithStatic<PostDocument, PostStaticMethods>,
    @InjectModel(User.name)
    private userModel: ModelWithStatic<UserDocument, UserModelStatics>,
    @InjectModel(Like.name)
    private likeModel: Model<LikeDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Ban.name) private banModel: Model<BanDocument>,
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
    const { limit, pageNumber } = config;
    return this.paginationOutput({ totalCount, limit, pageNumber }, items);
  }

  public async getPostEntity(postId: string | ObjectId): Promise<PostDocument> {
    return await this.findById(this.postModel, postId);
  }

  public async getExtendedLikeInfo(
    post: PostDocument,
    userId: string,
  ): Promise<WithExtendedLike<PostPresentationModel>> {
    const [[{ likesCount, dislikesCount, myStatus }], newestLikes] =
      await Promise.all([
        this.countLikesInfo(this.likeModel, [post], userId),
        this.getLastLikes(this.likeModel, post._id),
      ]);
    return {
      ...(post.toJSON() as PostPresentationModel),
      extendedLikesInfo: {
        likesCount,
        dislikesCount,
        myStatus,
        newestLikes,
      },
    };
  }

  public async getPaginatedPosts(
    userId: Nullable<string>,
    config: IPaginationConfig,
  ): Promise<PaginatedOutput<WithExtendedLike<PostPresentationModel>>> {
    const [itemsWithoutLike, totalCount] = await this.paginate(
      this.postModel,
      config,
    );
    const likesInfo = await this.countLikesInfo(
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

  public async getUserEntity(userId: string): NullablePromise<UserDocument> {
    return await this.findById(this.userModel, userId);
  }

  public async getLikeForPost(
    postId: string,
    userId: string,
  ): NullablePromise<LikeDocument> {
    return await this.getLikeForTarget(this.likeModel, userId, postId);
  }

  public async getLikeForComment(commentId: string, userId: string) {
    return await this.getLikeForTarget(this.likeModel, userId, commentId);
  }

  public async getCommentWithLike(
    commentId: string,
    userId: Nullable<string>,
  ): Promise<WithLike<CommentPresentationModel>> {
    const comment = await this.findById(this.commentModel, commentId);
    if (!comment || comment._isOwnerBanned) {
      throw new NotFoundException();
    }
    const [{ likesCount, dislikesCount, myStatus }] = await this.countLikesInfo(
      this.likeModel,
      [comment],
      userId,
    );
    return {
      ...(comment.toJSON() as CommentPresentationModel),
      likesInfo: {
        likesCount,
        dislikesCount,
        myStatus,
      },
    };
  }

  public async getPaginatedComments(
    postId: ObjectId,
    userId: string,
    config: IPaginationConfig,
  ) {
    const post = await this.getPostEntity(postId);
    if (!post || post._isOwnerBanned || post._isBlogBanned) {
      throw new NotFoundException();
    }
    const [itemsWithoutLike, totalCount] = await this.paginate<CommentDocument>(
      this.commentModel,
      config,
    );
    const likesInfo = await this.countLikesInfo<CommentDocument>(
      this.likeModel,
      itemsWithoutLike,
      userId,
    );
    const items = itemsWithoutLike.map((item, idx) => {
      return {
        ...item.toJSON(),
        likesInfo: likesInfo[idx],
      };
    });
    return {
      pagesCount: Math.ceil(totalCount / config.limit),
      page: config.pageNumber,
      pageSize: config.limit,
      totalCount,
      items,
    };
  }

  public async getCommentEntity(
    commentId: string | ObjectId,
  ): NullablePromise<CommentDocument> {
    return await this.findById(this.commentModel, commentId);
  }

  public async getBanEntity(
    blogId: ObjectId,
    userId: ObjectId,
  ): NullablePromise<BanDocument> {
    return await this.findOneWithFilter(this.banModel, {
      blogId,
      bannedUserId: userId,
    });
  }
}
