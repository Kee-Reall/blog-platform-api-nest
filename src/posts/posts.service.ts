import {
  BadRequestException,
  ImATeapotException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostsCommandRepository, PostsQueryRepository } from './repos';
import { MessageENUM } from '../helpers';
import {
  Blog,
  BlogDocument,
  BlogSchemaMethods,
  Nullable,
  Post,
  PostCreateModel,
  PostDocument,
  PostSchemaMethods,
  PostPresentationModel,
  VoidPromise,
  WithExtendedLike,
  LikeStatus,
  LikeDocument,
  Like,
} from '../Model';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Blog.name)
    private blogModel: Model<BlogDocument> & BlogSchemaMethods,
    @InjectModel(Post.name)
    private postModel: Model<PostDocument> & PostSchemaMethods,
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
    private commandRepo: PostsCommandRepository,
    private queryRepo: PostsQueryRepository,
  ) {}
  public async createPost(
    pojo: PostCreateModel,
  ): Promise<WithExtendedLike<PostPresentationModel>> {
    const blog: Nullable<BlogDocument> = await this.blogModel.NullableFindById(
      pojo.blogId,
    );
    if (!blog) {
      throw new NotFoundException();
    }
    const post = new this.postModel({ ...pojo, blogName: blog.name });
    const isSaved: boolean = await this.commandRepo.savePost(post);
    if (!isSaved) {
      throw new ImATeapotException();
    }
    return {
      ...(post.toJSON() as PostPresentationModel),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
  }

  public async updatePost(id: string, pojo: PostCreateModel) {
    const post = await this.postModel.NullableFindById(id);
    if (!post) {
      throw new NotFoundException();
    }
    const blog: Nullable<BlogDocument> = await this.blogModel.NullableFindById(
      pojo.blogId,
    );
    if (!blog) {
      throw new BadRequestException({
        errorMessages: [{ message: MessageENUM.NOT_EXIST, field: 'blogId' }],
      });
    }
    for (const key in pojo) {
      post[key] = pojo[key];
    }
    post.blogName = blog.name;
    const isSaved = await this.commandRepo.savePost(post);
    if (!isSaved) {
      throw new ImATeapotException();
    }
    return;
  }

  public async deletePost(id: string): VoidPromise {
    const isDeleted: boolean = await this.commandRepo.deletePost(id);
    if (!isDeleted) {
      throw new NotFoundException();
    }
    return;
  }

  public async likePost(
    postId: string,
    likeStatus: LikeStatus,
    userId: string,
  ) {
    const like = await this.queryRepo.getLikeForPost(postId, userId);
    if (!like) {
      await this.createLikePost(postId, likeStatus, userId);
      return;
    }
    await like.setLikeStatus(likeStatus);
    return;
  }

  private async createLikePost(
    postId: string,
    likeStatus: LikeStatus,
    userId: string,
  ) {
    const [post, user] = await Promise.all([
      this.queryRepo.findPostById(postId),
      this.queryRepo.getUser(userId),
    ]);
    if (!post || !user) {
      throw new NotFoundException();
    }
    const like = new this.likeModel({
      likeStatus,
      userId: user._id,
      target: post._id,
      login: user.login,
    });
    const isSaved = await this.commandRepo.saveLike(like);
    if (!isSaved) {
      throw new ImATeapotException();
    }
    return;
  }
}
