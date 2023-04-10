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
  Comment,
  CommentDocument,
  IPaginationConfig,
  NullablePromise,
  PaginatedOutput,
  Populated,
  Post,
  PostDocument,
  User,
  UserDocument,
  UserForBloggerPresentation,
} from '../../Model';

@Injectable()
export class BloggerQueryRepository extends Repository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Ban.name) private banModel: Model<BanDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {
    super();
  }
  public async getBlogsWithPaginationConfigForUser(
    config: IPaginationConfig,
  ): Promise<PaginatedOutput<BlogPresentationModel>> {
    const [itemsDoc, totalCount] = await this.paginate(this.blogModel, config);
    const items = itemsDoc as unknown as BlogPresentationModel[];
    const { limit, pageNumber } = config;
    return this.paginationOutput({ limit, pageNumber, totalCount }, items);
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

  public async getBannedUsersWithPaginationConfigForOwner(
    config: IPaginationConfig,
  ): Promise<PaginatedOutput<UserForBloggerPresentation>> {
    const [itemsDoc, totalCount] = await this.paginate(this.banModel, config);
    const items = itemsDoc.map((user) => user.toPresentationModel());
    const { limit, pageNumber } = config;
    return this.paginationOutput({ totalCount, limit, pageNumber }, items);
  }

  public async getAllPostsByOwner(userId: string) {
    return await this.findManyWithFilter(this.postModel, {
      _ownerId: new ObjectId(userId),
    });
  }

  public async getCommentsForPost(config: IPaginationConfig) {
    const [itemsDoc, totalCount] = await this.paginate(
      this.commentModel,
      config,
    );
    const items = await Promise.all(
      itemsDoc.map(async (comment) => {
        const populatedComment = (await comment.populate(
          'postId',
        )) as Populated<CommentDocument, PostDocument, 'postId'>;
        return {
          ...populatedComment.toJSON(),
          postInfo: populatedComment.postId.toPopulatedView(),
        };
      }),
    );
    const { limit, pageNumber } = config;
    return this.paginationOutput({ totalCount, limit, pageNumber }, items);
  }
}
