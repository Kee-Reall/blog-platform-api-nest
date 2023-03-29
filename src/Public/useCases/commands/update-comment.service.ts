import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { VoidPromise } from '../../../Model';
import { PublicQueryRepository } from '../../repos';

export class UpdateComment {
  constructor(
    public userId: string,
    public commentId: string,
    public content: string,
  ) {}
}

@CommandHandler(UpdateComment)
export class UpdateCommentUseCase implements ICommandHandler<UpdateComment> {
  constructor(private repo: PublicQueryRepository) {}

  public async execute(command: UpdateComment): VoidPromise {
    const comment = await this.repo.getCommentEntity(command.commentId);
    if (!comment) {
      throw new NotFoundException();
    }
    if (!comment.isOwner(command.userId)) {
      throw new ForbiddenException();
    }
    await comment.changeContent(command.content);
    return;
  }
}
