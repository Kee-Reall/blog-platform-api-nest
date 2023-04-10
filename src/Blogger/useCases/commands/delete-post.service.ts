import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ForbiddenException,
  ImATeapotException,
  NotFoundException,
} from '@nestjs/common';
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
    // const entities = await Promise.all([
    //   this.queryRepo.getUserEntity(command.userId),
    //   this.queryRepo.getBlogEntity(command.blogId),
    //   this.queryRepo.getPostEntity(command.postId),
    // ]);
    // if (!this.isAllFound(entities)) {
    //   throw new NotFoundException();
    // }
    // const [user, blog, post] = entities;
    // if (blog._isOwnerBanned) {
    //   throw new NotFoundException();
    // }
    // if (!this.isPostBelongToBlog(post, blog)) {
    //   throw new NotFoundException();
    // }
    // if (!this.isUserOwnBlogAndPost(user, blog, post)) {
    //   throw new ForbiddenException();
    // }
    const isDeleted = await this.commandRepo.deletePost(post.id);
    if (!isDeleted) {
      throw new ImATeapotException();
    }
  }
}
