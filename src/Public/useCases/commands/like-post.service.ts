import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ImATeapotException, NotFoundException } from '@nestjs/common';
import { Like, LikeDocument, LikeStatus, VoidPromise } from '../../../Model';
import { PublicQueryRepository, PublicCommandRepository } from '../../repos';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class LikePost {
  constructor(
    public userId: string,
    public postId: string,
    public likeStatus: LikeStatus,
  ) {}
}

@CommandHandler(LikePost)
export class LikePostUseCase implements ICommandHandler<LikePost> {
  constructor(
    private queryRepo: PublicQueryRepository,
    private commandRepo: PublicCommandRepository,
    @InjectModel(Like.name)
    private likeModel: Model<LikeDocument>,
  ) {}
  public async execute(command: LikePost): VoidPromise {
    const like = await this.queryRepo.getLikeForPost(
      command.postId,
      command.userId,
    );
    if (!like) {
      await this.createLikePost(
        command.postId,
        command.likeStatus,
        command.userId,
      );
      return;
    }
    await like.setLikeStatus(command.likeStatus);
    return;
  }

  private async createLikePost(
    postId: string,
    likeStatus: LikeStatus,
    userId: string,
  ) {
    const [post, user] = await Promise.all([
      this.queryRepo.getPostEntity(postId),
      this.queryRepo.getUserEntity(userId),
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
