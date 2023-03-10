import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../../Model/Schema/post.schema';
import { Blog, BlogDocument } from '../../Model/Schema/blog.schema';
import { PostPresentationModel } from '../../Model/Type/posts.types';
import { CommentsFilter, PostFilters } from '../../Model/Type/query.types';
import { PostsPaginationConfig } from './posts.pagination-config';
import { Repository } from '../../helpers/classes/repository.class';
import { Like, LikeDocument } from '../../Model/Schema/like.schema';
import { WithExtendedLike } from '../../Model/Type/likes.types';
import { PaginatedOutput } from '../../Model/Type/pagination.types';
import { CommentsPaginationConfig } from './comments.pagination-config';
import { CommentDocument, Comment } from '../../Model/Schema/comment.schema';

@Injectable()
export class PostsQueryRepository extends Repository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {
    super();
  }

  public async findPostById(
    id: string,
  ): Promise<WithExtendedLike<PostPresentationModel>> {
    const post = await this.findById(this.postModel, id);
    if (!post) {
      throw new NotFoundException();
    }
    const [[{ likesCount, dislikesCount, myStatus }], newestLikes] =
      await Promise.all([
        this.countLikesInfo(this.likeModel, [post]),
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
    query: PostFilters,
  ): Promise<PaginatedOutput<WithExtendedLike<PostPresentationModel>>> {
    const config = new PostsPaginationConfig(query);
    const [itemsWithoutLike, totalCount] = await this.paginate(
      this.postModel,
      config,
    );
    const likesInfo = await this.countLikesInfo(
      this.likeModel,
      itemsWithoutLike,
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

  public async getPaginatedComments(query: CommentsFilter, postId: string) {
    const config = new CommentsPaginationConfig(query, postId);
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
}
