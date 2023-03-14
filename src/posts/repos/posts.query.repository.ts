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
          ...item.toJSON(),
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

  public async getPaginatedComments(config: CommentsPaginationConfig) {
    const [itemsWithoutLike, totalCount] = await this.paginate<CommentDocument>(
      this.commentModel,
      config,
    );
    const likesInfo = await this.countLikesInfo<CommentDocument>(
      this.likeModel,
      itemsWithoutLike,
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

  public async getUser(userId: string) {
    return await this.findById(this.userModel, userId);
  }

  public async getLikeForPost(postId: string, userId: string) {
    return await super.getLikeForTarget(this.likeModel, userId, postId);
  }
}
