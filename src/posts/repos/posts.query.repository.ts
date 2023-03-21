import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Repository } from '../../helpers';
import { CommentsPaginationConfig } from '../pipes/comments.pagination.class';
import {
  Blog,
  BlogDocument,
  Comment,
  CommentDocument,
  CommentPresentationModel,
  IPaginationConfig,
  Like,
  LikeDocument,
  Nullable,
  PaginatedOutput,
  Post,
  PostDocument,
  PostPresentationModel,
  User,
  UserDocument,
  WithExtendedLike,
  WithLike,
} from '../../Model';

@Injectable()
export class PostsQueryRepository extends Repository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    super();
  }

  public async findPostByIdWithLike(
    id: string,
    userId: string,
  ): Promise<WithExtendedLike<PostPresentationModel>> {
    const post = await this.findById(this.postModel, id);
    if (!post) {
      throw new NotFoundException();
    }
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

  public async findPostById(postId: string) {
    return await this.findById(this.postModel, postId);
  }

  public async getPaginatedPosts(
    config: IPaginationConfig,
    userId: Nullable<string>,
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

  public async getPaginatedComments(
    inputQuery: CommentsPaginationConfig,
    postId: string,
    userId: string,
  ) {
    const post = await this.findPostById(postId);
    if (!post) {
      throw new NotFoundException();
    }
    const config = new CommentsPaginationConfig(inputQuery, post._id);
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

  public async getCommentWithLike(
    commentId: string,
    userId: Nullable<string>,
  ): Promise<WithLike<CommentPresentationModel>> {
    const comment = await this.findById(this.commentModel, commentId);
    if (!comment) {
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

  public async getUser(userId: string) {
    return await this.findById(this.userModel, userId);
  }

  public async getLikeForPost(postId: string, userId: string) {
    return await super.getLikeForTarget(this.likeModel, userId, postId);
  }

  public async getLikeForComment(commentId: string, userId: string) {
    return await super.getLikeForTarget(this.likeModel, userId, commentId);
  }

  public async getComment(commentId: string) {
    return await this.findById(this.commentModel, commentId);
  }

  public async isBlogExist(blogId: string): Promise<boolean> {
    return !!(await this.findById(this.blogModel, blogId));
  }
}
