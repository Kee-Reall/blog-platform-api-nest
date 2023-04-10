import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ImATeapotException } from '@nestjs/common';
import { BloggerService } from './blogger.service';
import { BloggerCommandRepository, BloggerQueryRepository } from '../../repos';

export class DeletePost {
  constructor(
    public userId: string,
    public blogId: string,
    public postId: string,
  ) {}
}

@CommandHandler(DeletePost)
export class DeletePostUseCase
  extends BloggerService
  implements ICommandHandler<DeletePost>
{
  constructor(
    private queryRepo: BloggerQueryRepository,
    private commandRepo: BloggerCommandRepository,
  ) {
    super();
  }

  public async execute(command: DeletePost) {
    const post = await this.checkEntitiesThenGetPost(command, this.queryRepo);
    const isDeleted = await this.commandRepo.deletePost(post.id);
    if (!isDeleted) {
      throw new ImATeapotException();
    }
  }
}
