import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BloggerService } from './blogger.service';
import { PostInputModel, VoidPromise } from '../../../Model';
import { BloggerCommandRepository, BloggerQueryRepository } from '../../repos';

export class UpdatePost implements PostInputModel {
  content: string;
  shortDescription: string;
  title: string;

  constructor(
    public userId: string,
    public blogId: string,
    public postId: string,
    dto: PostInputModel,
  ) {
    this.content = dto.content;
    this.shortDescription = dto.shortDescription;
    this.title = dto.title;
  }
}

@CommandHandler(UpdatePost)
export class UpdatePostUseCase
  extends BloggerService
  implements ICommandHandler<UpdatePost>
{
  constructor(
    private queryRepo: BloggerQueryRepository,
    private commandRepo: BloggerCommandRepository,
  ) {
    super();
  }
  public async execute(command: UpdatePost): VoidPromise {
    const post = await this.checkEntitiesThenGetPost(command, this.queryRepo);
    post.title = command.title;
    post.content = command.content;
    post.shortDescription = command.shortDescription;
    await this.commandRepo.savePost(post);
    return;
  }
}
