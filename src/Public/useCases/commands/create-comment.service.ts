import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  Comment,
  CommentDocument,
  CommentPresentationModel,
  WithLike,
} from '../../../Model';
import { ImATeapotException, NotFoundException } from '@nestjs/common';
import { PublicCommandRepository, PublicQueryRepository } from '../../repos';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

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
    return await this.queryRepo.getCommentWithLike(comment.id, user.id);
  }
}
