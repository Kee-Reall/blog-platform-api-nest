import {
  ForbiddenException,
  ImATeapotException,
  NotFoundException,
} from '@nestjs/common';
import { VoidPromise } from '../../../Model';
import { BloggerService } from './blogger.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BloggerCommandRepository, BloggerQueryRepository } from '../../repos';

export class DeleteBlog {
  constructor(public userId: string, public blogId: string) {}
}

@CommandHandler(DeleteBlog)
export class DeleteBlogUseCase
  extends BloggerService
  implements ICommandHandler<DeleteBlog>
{
  constructor(
    private queryRepo: BloggerQueryRepository,
    private commandRepo: BloggerCommandRepository,
  ) {
    super();
  }
  public async execute(command: DeleteBlog): VoidPromise {
    const blog = await this.queryRepo.getBlogEntity(command.blogId);
    if (!blog) {
      throw new NotFoundException();
    }
    if (!this.isOwner(command.userId, blog._blogOwnerInfo.userId)) {
      console.log(command.userId, blog._id);
      throw new ForbiddenException();
    }
    const isDeleted = await this.commandRepo.deleteBlog(blog.id);
    if (!isDeleted) {
      throw new ImATeapotException();
    }
    await this.commandRepo.deletePostsByBlogId(blog._id);
    return;
  }
}
