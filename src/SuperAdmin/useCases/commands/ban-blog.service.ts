import { ImATeapotException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogDocument, VoidPromise } from '../../../Model';
import { AdminCommandRepository, AdminQueryRepository } from '../../repos';

export class BanBlog implements Pick<BanBlog, 'isBanned'> {
  constructor(public blogId: string, public isBanned: boolean) {}
}

@CommandHandler(BanBlog)
export class BanBlogUseCase implements ICommandHandler<BanBlog> {
  constructor(
    private queryRepo: AdminQueryRepository,
    private commandRepo: AdminCommandRepository,
  ) {}
  public async execute(command: BanBlog): VoidPromise {
    const blog = await this.queryRepo.getBlogEntity(command.blogId);
    if (!blog) {
      throw new NotFoundException();
    }
    const isSameStatus = blog._isBlogBanned === command.isBanned;
    if (isSameStatus) {
      console.log(blog._isBlogBanned, command.isBanned);
      console.log('abort');
      return; // nothing to change, just exit
    }
    const isBanned = await this.setBanStatus(blog, command.isBanned);
    if (!isBanned) {
      throw new ImATeapotException();
    }
    return;
  }

  private async setBanStatus(
    blog: BlogDocument,
    status: boolean,
  ): Promise<boolean> {
    return this.commandRepo.banBlogEntities(blog, status);
  }
}
