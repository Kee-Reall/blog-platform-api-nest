import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ForbiddenException,
  ImATeapotException,
  NotFoundException,
} from '@nestjs/common';
import { BlogInputModel, VoidPromise } from '../../../Model';
import { BloggerCommandRepository, BloggerQueryRepository } from '../../repos';
import { BloggerService } from './blogger.service';

export class UpdateBlog implements BlogInputModel {
  description: string;

  name: string;
  websiteUrl: string;
  planedDto: string;
  constructor(
    public userId: string,
    public blogId: string,

    dto: BlogInputModel,
  ) {
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;
    this.name = dto.name;
    this.planedDto = JSON.stringify(dto);
  }
}

@CommandHandler(UpdateBlog)
export class UpdateBlogUseCase
  extends BloggerService
  implements ICommandHandler<UpdateBlog>
{
  constructor(
    private queryRepo: BloggerQueryRepository,
    private commandRepo: BloggerCommandRepository,
  ) {
    super();
  }
  public async execute(command: UpdateBlog): VoidPromise {
    const blog = await this.queryRepo.getBlogEntity(command.blogId);
    if (!blog || blog._isBlogBanned) {
      throw new NotFoundException();
    }
    if (!this.isOwner(command.userId, blog._blogOwnerInfo.userId)) {
      throw new ForbiddenException();
    }
    const isSaved: boolean = await this.commandRepo.saveBlog(blog);
    if (!isSaved) {
      throw new ImATeapotException();
    }
    const after: BlogInputModel = {
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      name: blog.name,
    };
    if (this.shouldSave(command.planedDto, after)) {
      blog.description = command.description;
      blog.websiteUrl = command.websiteUrl;
      blog.name = command.name;
      if (!(await this.commandRepo.saveBlog(blog))) {
        throw new ImATeapotException();
      }
    }
    return;
  }

  private shouldSave(planedDto: string, after: BlogInputModel): boolean {
    return planedDto !== JSON.stringify(after);
  }
}
