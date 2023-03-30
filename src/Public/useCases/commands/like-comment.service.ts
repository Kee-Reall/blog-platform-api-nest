import { Like, LikeDocument, LikeStatus, VoidPromise } from '../../../Model';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ImATeapotException, NotFoundException } from '@nestjs/common';
import { PublicCommandRepository, PublicQueryRepository } from '../../repos';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class LikeComment {
  constructor(
    public userId: string,
    public commentId: string,
    public likeStatus: LikeStatus,
  ) {}
}

@CommandHandler(LikeComment)
export class LikeCommentUseCase implements ICommandHandler<LikeComment> {
  constructor(
    private queryRepo: PublicQueryRepository,
    private commandRepo: PublicCommandRepository,
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
  ) {}
  public async execute(command: LikeComment): VoidPromise {
    const like = await this.queryRepo.getLikeForComment(
      command.commentId,
      command.userId,
    );
    if (!like) {
      await this.createLikeComment(
        command.commentId,
        command.likeStatus,
        command.userId,
      );
      return;
    }
    await like.setLikeStatus(command.likeStatus);
    return;
  }

  private async createLikeComment(
    commentId: string,
    likeStatus: LikeStatus,
    userId: string,
  ) {
    const [comment, user] = await Promise.all([
      this.queryRepo.getCommentEntity(commentId),
      this.queryRepo.getUserEntity(userId),
    ]);
    if (!comment || !user) {
      throw new NotFoundException();
    }
    const like = new this.likeModel({
      likeStatus,
      userId: user._id,
      target: comment._id,
      login: user.login,
    });
    const isSaved = await this.commandRepo.saveLike(like);
    if (!isSaved) {
      throw new ImATeapotException();
    }
    return;
  }
}
