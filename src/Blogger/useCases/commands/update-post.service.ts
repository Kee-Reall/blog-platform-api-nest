import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BloggerService } from './blogger.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
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
    post.title = command.title;
    post.content = command.content;
    post.shortDescription = command.shortDescription;
    await this.commandRepo.savePost(post);
    return;
  }
}
