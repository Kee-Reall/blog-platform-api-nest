import { ImATeapotException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogDocument, VoidPromise } from '../../../Model';
import { AdminCommandRepository, AdminQueryRepository } from '../../repos';

export class BanBlog implements Pick<BanBlog, 'isBanned'> {
  constructor(public blogId: string, public isBanned: boolean) {}
}

@CommandHandler(CommandHandler)
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
    const isStatusDifferent = blog._isBlogBanned !== command.isBanned;
    if (isStatusDifferent) {
      return; // nothing to change, just exit
    }
    const isBanned = await this.setBanStatus(blog);
    if (!isBanned) {
      throw new ImATeapotException();
    }
    return;
  }

  private async setBanStatus(blog: BlogDocument): Promise<boolean> {
    return this.commandRepo.banBlogEntities(blog);
  }
}
