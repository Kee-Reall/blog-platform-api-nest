import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  BadRequestException,
  ImATeapotException,
  NotFoundException,
} from '@nestjs/common';
import { VoidPromise } from '../../../Model';
import { MessageENUM } from '../../../Helpers';
import { AdminCommandRepository, AdminQueryRepository } from '../../repos';

export class BindBlog {
  constructor(public userId: string, public blogId: string) {}
}

@CommandHandler(BindBlog)
export class BindBlogUseCase implements ICommandHandler<BindBlog> {
  constructor(
    private queryRepo: AdminQueryRepository,
    private commandRepo: AdminCommandRepository,
  ) {}
  public async execute(command: BindBlog): VoidPromise {
    const blog = await this.queryRepo.getBlogEntity(command.blogId);
    if (!blog) {
      throw new NotFoundException();
    }
    if (blog._blogOwnerInfo.userId) {
      throw new BadRequestException({
        errorsMessages: [{ message: MessageENUM.NOT_ALLOW, field: 'blogId' }],
      });
    }
    const user = await this.queryRepo.getUserEntity(command.userId);
    if (!user) {
      throw new NotFoundException();
    }
    blog._blogOwnerInfo.userId = user._id;
    const isSaved = await this.commandRepo.saveBlog(blog);
    if (!isSaved) {
      throw new ImATeapotException();
    }
    return;
  }
}
