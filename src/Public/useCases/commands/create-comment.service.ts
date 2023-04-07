import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ImATeapotException, NotFoundException } from '@nestjs/common';
import { PublicCommandRepository, PublicQueryRepository } from '../../repos';
import {
  BlogDocument,
  Comment,
  CommentDocument,
  CommentPresentationModel,
  LikesInfo,
  Populated,
  PostDocument,
  WithLike,
} from '../../../Model';

export class CreateComment {
  constructor(
    public userId: string,
    public postId: string,
    public content: string,
  ) {}
}

@CommandHandler(CreateComment)
export class CreateCommentUseCase implements ICommandHandler<CreateComment> {
  constructor(
    private queryRepo: PublicQueryRepository,
    private commandRepo: PublicCommandRepository,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}
  public async execute(
    command: CreateComment,
  ): Promise<WithLike<CommentPresentationModel>> {
    const [post, user] = await Promise.all([
      this.queryRepo.getPostEntity(command.postId),
      this.queryRepo.getUserEntity(command.userId),
    ]);
    if (!post || !user) {
      throw new NotFoundException();
    }
    if (post._isBlogBanned) {
      throw new NotFoundException();
    }
    const populatedPost = (await post.populate('blogId')) as Populated<
      PostDocument,
      BlogDocument,
      'blogId'
    >;
    if (populatedPost.blogId._banList.includes(user.id)) {
      //todo should keep hexstring or objectId? write unit test to check it
      throw new NotFoundException();
    }
    const comment = new this.commentModel({
      postId: post._id,
      content: command.content,
      commentatorInfo: {
        userId: user._id,
        userLogin: user.login,
      },
    });
    const isSaved = await this.commandRepo.saveComment(comment);
    if (!isSaved) {
      throw new ImATeapotException();
    }
    return {
      ...(comment.toJSON() as CommentPresentationModel),
      likesInfo: this.generateDefaultLikesInfo(),
    };
  }

  private generateDefaultLikesInfo(): LikesInfo {
    return {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
    };
  }
}
