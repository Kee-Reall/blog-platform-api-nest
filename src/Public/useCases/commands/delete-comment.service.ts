import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ForbiddenException,
  ImATeapotException,
  NotFoundException,
} from '@nestjs/common';
import { VoidPromise } from '../../../Model';
import { PublicCommandRepository, PublicQueryRepository } from '../../repos';

export class DeleteComment {
  constructor(public userId: string, public commentId: string) {}
}

@CommandHandler(DeleteComment)
export class DeleteCommentUseCase implements ICommandHandler<DeleteComment> {
  constructor(
    private queryRepo: PublicQueryRepository,
    private commandRepo: PublicCommandRepository,
  ) {}
  public async execute(command: DeleteComment): VoidPromise {
    const comment = await this.queryRepo.getCommentEntity(command.commentId);
    if (!comment || comment._isOwnerBanned) {
      throw new NotFoundException();
    }
    if (!comment.isOwner(command.userId)) {
      throw new ForbiddenException();
    }
    const isSaved = await this.commandRepo.deleteComment(comment);
    if (!isSaved) {
      throw new ImATeapotException();
    }
    return;
  }
}
